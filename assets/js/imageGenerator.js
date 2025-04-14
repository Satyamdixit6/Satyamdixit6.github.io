class ImageGenerator {
    constructor() {
        this.model = null;
        this.isReady = false;
    }

    async initialize() {
        try {
            // Load tokenizer
            await tokenizer.load(
                './assets/models/vocab.json',
                './assets/models/tokenizer.json'
            );
            
            // Load ONNX model
            this.model = await ort.InferenceSession.create(
                './assets/models/image_generator.onnx',
                { executionProviders: ['wasm'] }
            );
            
            this.isReady = true;
            console.log('Image generator ready');
        } catch (error) {
            console.error('Image generator initialization failed:', error);
            throw error;
        }
    }

    async generate(prompt, numSteps = 25, guidanceScale = 7.5) {
        if (!this.isReady) throw new Error('Image generator not ready');
        
        // Tokenize prompt
        const tokens = tokenizer.tokenize(prompt);
        let inputIds = tokenizer.convertTokensToIds(tokens);
        
        // Pad/truncate to 77 tokens
        inputIds = inputIds.slice(0, 76);
        while (inputIds.length < 77) {
            inputIds.push(tokenizer.specialTokens['[PAD]']);
        }
        
        // Prepare inputs
        const inputs = {
            input_ids: new ort.Tensor('int64', new BigInt64Array(inputIds.map(BigInt)), [1, 77]),
            num_inference_steps: new ort.Tensor('int64', new BigInt64Array([BigInt(numSteps)])),
            guidance_scale: new ort.Tensor('float32', new Float32Array([guidanceScale]))
        };

        // Run inference
        const startTime = performance.now();
        const outputs = await this.model.run(inputs);
        const genTime = ((performance.now() - startTime)/1000).toFixed(1);
        
        return {
            imageData: outputs.image.data,
            generationTime: genTime
        };
    }

    renderToCanvas(imageData, canvasId) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        const pixelData = new Uint8ClampedArray(imageData.length);
        
        // Normalize to 0-255
        for (let i = 0; i < imageData.length; i++) {
            pixelData[i] = Math.min(255, Math.max(0, Math.round(imageData[i] * 255)));
        }
        
        const imageDataObj = new ImageData(pixelData, canvas.width, canvas.height);
        ctx.putImageData(imageDataObj, 0, 0);
    }
}

const imageGenerator = new ImageGenerator();