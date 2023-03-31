#![allow(non_upper_case_globals)]
#![allow(non_camel_case_types)]
#![allow(non_snake_case)]

pub mod ggml;

use std::ffi::CString;
use std::path::Path;

include!(concat!(env!("OUT_DIR"), "/llama.rs"));

impl llama_context_params {
    fn new() -> llama_context_params {
        unsafe { llama_context_default_params() }
    }
}

pub struct LlamaContext {
    ctx: *mut llama_context,
}

impl LlamaContext {
    pub fn new_from_file<P: AsRef<Path>>(
        path: P,
        params: llama_context_params,
    ) -> Result<Self, &'static str> {
        let path_model = CString::new(path.as_ref().to_string_lossy().into_owned())
            .map_err(|_| "Failed to convert path to CString")?;

        let ctx = unsafe { llama_init_from_file(path_model.as_ptr(), params) };
        if ctx.is_null() {
            Err("Failed to initialize Llama context from file")
        } else {
            Ok(Self { ctx })
        }
    }
}

impl Drop for LlamaContext {
    fn drop(&mut self) {
        unsafe { llama_free(self.ctx) }
    }
}

mod tests {
    use std::path;

    use super::*;

    // I am just stepping through the code in main.cpp and writing tests for each step
    // some of these may be excessive but I am just trying to get a feel for how to use the library

    #[test]
    fn param_creation_works() {
        let params = llama_context_params::new();
        print!("{:?}", params);
        assert_eq!(params.n_ctx, 512);
    }

    #[test]
    fn load_file_works() {
        let params = llama_context_params::new();
        let path_model = "models/gpt4all-lora-quantized.bin";

        let ctx = LlamaContext::new_from_file(path_model, params)
            .expect("Failed to load Llama context from file");

        assert!(!ctx.ctx.is_null());
    }

    #[test]
    fn tokenizer_works() {
        let params = llama_context_params::new();
        let path_model = "models/gpt4all-lora-quantized.bin";

        let mut ctx = LlamaContext::new_from_file(path_model, params)
            .expect("Failed to load Llama context from file");

        let input_text = "This is a test.";
        let add_bos = true;

        let c_input_text =
            CString::new(input_text).expect("Failed to convert input_text to CString");

        let max_tokens = (input_text.len() + add_bos as usize) as i32;
        let mut tokens: Vec<llama_token> = vec![llama_token::default(); max_tokens as usize];

        let n_tokens = unsafe {
            llama_tokenize(
                ctx.ctx,
                c_input_text.as_ptr(),
                tokens.as_mut_ptr(),
                max_tokens,
                add_bos,
            )
        };

        println!("len:{:?} tokens:{:?}", n_tokens, tokens);
        assert!(n_tokens >= 0, "Tokenization failed");
        println!("len:{:?} tokens:{:?}", n_tokens, tokens);
        tokens.resize(n_tokens as usize, 0);

        assert!(!tokens.is_empty(), "Tokenized output is empty");
    }

    // #[test]
    // fn generate_response() {
    //     let params = llama_context_params::new();
    //     let path_model = "models/gpt4all-lora-quantized.bin";

    //     let mut ctx = LlamaContext::new_from_file(path_model, params)
    //         .expect("Failed to load Llama context from file");

    //     let input_text = "This is a test.";
    //     let add_bos = true;

    //     let c_input_text =
    //         CString::new(input_text).expect("Failed to convert input_text to CString");

    //     let max_tokens = input_text.len() + add_bos as usize;
    //     let mut tokens: Vec<llama_token> = vec![llama_token::default(); max_tokens];

    //     let n_tokens = unsafe {
    //         llama_tokenize(
    //             ctx.ctx,
    //             c_input_text.as_ptr(),
    //             tokens.as_mut_ptr(),
    //             max_tokens.try_into().unwrap(),
    //             add_bos,
    //         )
    //     };

    //     let n_predict = 128;
    //     let n_threads = 4;

    //     let mut embd = Vec::new();
    //     let mut embd_inp = tokens.clone();
    //     let mut last_n_tokens = vec![llama_token::default(); n_ctx];

    //     while n_remain != 0 {
    //         unsafe {
    //             if llama_eval(
    //                 ctx.ctx,
    //                 embd.as_ptr(),
    //                 embd.len().try_into().unwrap(),
    //                 n_past,
    //                 n_threads,
    //             ) != 0
    //             {
    //                 panic!("Failed to eval");
    //             }
    //         }
    //         n_past += <usize as TryInto<i32>>::try_into(embd.len()).unwrap();
    //         embd.clear();

    //         // Process the remaining code to sample tokens, update last_n_tokens, and display text.
    //         // ...
    //     }
    // }
}
