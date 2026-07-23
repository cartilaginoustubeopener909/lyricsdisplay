/**
 * Author: https://github.com/codecnmc/tauri2-transparent-through
*/
use std::{
    sync::{Arc, Mutex},
    time::{Duration, Instant},
};

use rdev::{listen, EventType};
use tauri::{Emitter, State, WebviewWindow};

pub struct MouseProcessState {
    pub is_running: Mutex<bool>,
}

#[tauri::command]
pub fn start_global_mouse_stream(
    window: WebviewWindow,
    state: State<'_, MouseProcessState>,
) {
    let mut is_running = state.is_running.lock().unwrap();

    if *is_running {
        return;
    }

    let window_clone = window.clone();
    
    std::thread::spawn(move || {
        let last_emit = Arc::new(Mutex::new(Instant::now()));
        
        let callback = move |event: rdev::Event| {
            if let EventType::MouseMove { x, y } = event.event_type {
                let mut last = last_emit.lock().unwrap();
                if last.elapsed() >= Duration::from_millis(16) {
                    let json = format!("{{\"x\":{},\"y\":{}}}", x, y);
                    let _ = window_clone.emit("device-mouse-move", json);
                    *last = Instant::now();
                }
            }
        };

        if let Err(e) = listen(callback) {
            eprintln!("rdev error: {:?}", e);
        }
    });

    *is_running = true;
}

#[tauri::command]
pub fn stop_global_mouse_stream(
    state: State<'_, MouseProcessState>,
) {
    let mut is_running = state.is_running.lock().unwrap();
    // On Windows, rdev::listen runs a message loop. We can't cleanly abort it from outside 
    // without dropping the thread, but for our purposes it's fine to just leave it running 
    // or let it die when the app closes. We'll just mark it as not running.
    *is_running = false;
}
