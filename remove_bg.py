from rembg import remove
from PIL import Image

def process(input_p, output_p):
    try:
        input = Image.open(input_p)
        output = remove(input)
        output.save(output_p)
        print(f"Processed {input_p}")
    except Exception as e:
        print(f"Error processing {input_p}: {e}")

process(r"C:\Users\itsga\.gemini\antigravity-ide\brain\ca9d1b54-7a81-48e7-83eb-341cc4256d78\chat_model_idle_1784353944561.png", "public/chat-model.png")
process(r"C:\Users\itsga\.gemini\antigravity-ide\brain\ca9d1b54-7a81-48e7-83eb-341cc4256d78\chat_model_thinking_1784353684980.png", "public/chat-model-thinking.png")
process(r"C:\Users\itsga\.gemini\antigravity-ide\brain\ca9d1b54-7a81-48e7-83eb-341cc4256d78\chat_model_happy_1784353706535.png", "public/chat-model-happy.png")
