class TextGenerator {
    constructor() {
        this.model = null;
        this.isReady = false;
    }

    async initialize() {
        try {
            // Load tokenizer first
            await tokenizer.load(
                './assets/models/vocab.json',
                './assets/models/tokenizer.json'
            );
            
            // Then load ONNX model
            this.model = await ort.InferenceSession.create(
                './assets/models/text_generator.onnx',
                { executionProviders: ['wasm'] }
            );
            
            this.isReady = true;
            console.log('Text generator ready');
        } catch (error) {
            console.error('Text generator initialization failed:', error);
            throw error;
        }
    }

    async generate(prompt, maxLength = 100, temperature = 0.7) {
        if (!this.isReady) throw new Error('Text generator not ready');
        
        // Tokenize input
        const tokens = tokenizer.tokenize(prompt);
        const inputIds = tokenizer.convertTokensToIds(tokens);
        
        // Add special tokens
        inputIds.unshift(tokenizer.specialTokens['[CLS]']);
        inputIds.push(tokenizer.specialTokens['[SEP]']);
        
        // Prepare inputs
        const inputs = {
            input_ids: new ort.Tensor('int64', new BigInt64Array(inputIds.map(BigInt)), 
            attention_mask: new ort.Tensor('int64', new BigInt64Array(inputIds.map(() => BigInt(1))),
            max_length: new ort.Tensor('int64', new BigInt64Array([BigInt(maxLength)])),
            temperature: new ort.Tensor('float32', new Float32Array([temperature]))
        };

        // Run inference
        const outputs = await this.model.run(inputs);
        
        // Process output
        const outputIds = Array.from(outputs.output_logits.data).map(Number);
        const outputTokens = tokenizer.convertIdsToTokens(outputIds);
        
        return this.postProcess(outputTokens.join(' '));
    }

    postProcess(text) {
        return text
            .replace(/(\[CLS\]|\[SEP\]|\[PAD\])/g, '')
            .replace(/ ##/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
}

const textGenerator = new TextGenerator();