extern crate bindgen;

use std::env;
use std::path::PathBuf;

fn main() {
    // Tell cargo to look for shared libraries in the specified directory
    println!("cargo:rustc-link-search=/path/to/lib");

    // Tell cargo to tell rustc to link the system bzip2
    // shared library.
    println!("cargo:rustc-link-lib=bz2");

    // Tell cargo to invalidate the built crate whenever the wrapper changes
    println!("cargo:rerun-if-changed=llama.h");

    generate_binding("llama");
    generate_binding("utils");
    generate_binding("ggml");
}

fn generate_binding(file: &str) {
    let bindings = bindgen::Builder::default()
        .header(format!("llama.cpp/{}.h", file))
        .clang_arg("-x")
        .clang_arg("c++")
        .ctypes_prefix("libc")
        .parse_callbacks(Box::new(bindgen::CargoCallbacks))
        .generate()
        .expect("Unable to generate bindings");

    let out_path = PathBuf::from(env::var("OUT_DIR").unwrap());
    bindings
        .write_to_file(out_path.join(format!("{}.rs", file)))
        .expect("Couldn't write bindings!");
}
