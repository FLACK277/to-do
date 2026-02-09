import vertexai
from vertexai.preview.vision_models import ImageGenerationModel

def generate_image(prompt: str):
    # Initialize Vertex AI (project and location are usually pre-configured in labs)
    vertexai.init()

    # Load the Imagen 3 model
    model = ImageGenerationModel.from_pretrained("imagen-3.0-generate-002")

    # Generate image
    images = model.generate_images(
        prompt=prompt,
        number_of_images=1
    )

    # Save the first generated image
    image = images[0]
    image.save("image.jpeg")
    print("Image generated and saved as image.jpeg")


if __name__ == "__main__":
    prompt = "Create an image of a cricket ground in the heart of Los Angeles"
    generate_image(prompt)
