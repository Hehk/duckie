#![allow(non_upper_case_globals)]
#![allow(non_camel_case_types)]
#![allow(non_snake_case)]

pub mod ggml;
pub mod utils;

include!(concat!(env!("OUT_DIR"), "/llama.rs"));