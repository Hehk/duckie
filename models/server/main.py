from fastapi import FastAPI
from pydantic import BaseModel
from peft import PeftModel
from transformers import LLaMATokenizer, LLaMAForCausalLM, GenerationConfig

tokenizer = LLaMATokenizer.from_pretrained("decapoda-research/llama-7b-hf")
model = LLaMAForCausalLM.from_pretrained(
    "decapoda-research/llama-7b-hf",
    load_in_8bit=True,
    device_map="auto",
)
model = PeftModel.from_pretrained(model, "tloen/alpaca-lora-7b")

config = GenerationConfig(
    temperature=0.1,
    top_p=0.75,
    num_beams=4,
)


def generate(input):
    input_ids = tokenizer(input, return_tensors="pt").input_ids
    output = model.generate(input_ids, generation_config=config, return_dict_in_generate=True,
                            output_scores=True, max_new_tokens=256)
    for s in output.sequences:
        return tokenizer.decode(s)


app = FastAPI()


class Message(BaseModel):
    content: str


@app.post("/chat")
async def chat(message: Message):
    return {"content": message.content}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
