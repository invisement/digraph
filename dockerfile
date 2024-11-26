# Use the official Deno image as the base image
FROM denoland/deno:alpine

# Set the working directory in the container
WORKDIR /app

# Copy the project files to the container
COPY . .

RUN deno install --allow-import

# Expose the port your application listens on
EXPOSE 8080

# Start the Deno application
CMD ["deno", "task", "prod"]
