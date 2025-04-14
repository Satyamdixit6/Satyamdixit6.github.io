class Tokenizer {
    constructor() {
        this.vocab = null;
        this.specialTokens = {
            '[PAD]': 0,
            '[UNK]': 1,
            '[CLS]': 2,
            '[SEP]': 3,
            '[MASK]': 4
        };
        this.maxLength = 512;
    }

    async load(vocabPath, tokenizerConfigPath) {
        try {
            const [vocabRes, configRes] = await Promise.all([
                fetch(vocabPath),
                fetch(tokenizerConfigPath)
            ]);
            
            this.vocab = await vocabRes.json();
            const config = await configRes.json();
            this.maxLength = config.max_length || 512;
            
            // Merge special tokens
            Object.entries(config.special_tokens || {}).forEach(([key, value]) => {
                this.specialTokens[key] = value;
            });
            
            console.log('Tokenizer loaded');
            return true;
        } catch (error) {
            console.error('Tokenizer loading failed:', error);
            throw error;
        }
    }

    tokenize(text) {
        if (!this.vocab) throw new Error('Tokenizer not loaded');
        
        // Simple whitespace tokenization with subword splitting
        const tokens = [];
        const words = text.trim().split(/\s+/);
        
        for (const word of words) {
            let currentWord = word.toLowerCase();
            let start = 0;
            
            while (start < currentWord.length) {
                let found = false;
                
                // Try to find the longest subword
                for (let end = currentWord.length; end > start; end--) {
                    const subword = (start === 0 ? '' : '##') + 
                                   currentWord.slice(start, end);
                    
                    if (this.vocab[subword] !== undefined) {
                        tokens.push(subword);
                        start = end;
                        found = true;
                        break;
                    }
                }
                
                if (!found) {
                    tokens.push('[UNK]');
                    break;
                }
            }
        }
        
        return tokens.slice(0, this.maxLength - 2); // Reserve space for [CLS] and [SEP]
    }

    convertTokensToIds(tokens) {
        return tokens.map(token => {
            if (this.vocab[token] !== undefined) return this.vocab[token];
            if (this.specialTokens[token] !== undefined) return this.specialTokens[token];
            return this.specialTokens['[UNK]'];
        });
    }

    convertIdsToTokens(ids) {
        const idToToken = {};
        
        // Build reverse mapping
        Object.entries(this.vocab).forEach(([token, id]) => {
            idToToken[id] = token;
        });
        
        Object.entries(this.specialTokens).forEach(([token, id]) => {
            idToToken[id] = token;
        });
        
        return ids.map(id => idToToken[id] || '[UNK]');
    }
}

const tokenizer = new Tokenizer();