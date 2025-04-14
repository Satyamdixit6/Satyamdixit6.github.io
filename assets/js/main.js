document.addEventListener('DOMContentLoaded', async () => {
    // UI Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const textInput = document.getElementById('text-input');
    const imagePrompt = document.getElementById('image-prompt');
    const textOutput = document.getElementById('text-output');
    const imageStatus = document.getElementById('image-status');
    
    // Sliders
    const lengthSlider = document.getElementById('length-slider');
    const tempSlider = document.getElementById('temp-slider');
    const stepsSlider = document.getElementById('steps-slider');
    const guidanceSlider = document.getElementById('guidance-slider');
    
    // Update slider displays
    const updateSliderValues = () => {
        document.getElementById('length-value').textContent = lengthSlider.value;
        document.getElementById('temp-value').textContent = tempSlider.value;
        document.getElementById('steps-value').textContent = stepsSlider.value;
        document.getElementById('guidance-value').textContent = guidanceSlider.value;
    };
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });
    
    // Initialize models
    const initModels = async () => {
        try {
            const statusText = textOutput;
            statusText.textContent = 'Loading AI models...';
            
            await Promise.all([
                textGenerator.initialize(),
                imageGenerator.initialize()
            ]);
            
            statusText.textContent = 'Models loaded! Try generating something.';
            document.getElementById('generate-text-btn').disabled = false;
            document.getElementById('generate-image-btn').disabled = false;
            
            console.log('All models initialized');
        } catch (error) {
            textOutput.textContent = `Error loading models: ${error.message}`;
            textOutput.classList.add('error');
            console.error('Initialization error:', error);
        }
    };
    
    // Text generation
    document.getElementById('generate-text-btn').addEventListener('click', async () => {
        const btn = this;
        btn.disabled = true;
        btn.classList.add('loading');
        textOutput.textContent = 'Generating...';
        
        try {
            const generatedText = await textGenerator.generate(
                textInput.value,
                parseInt(lengthSlider.value),
                parseFloat(tempSlider.value)
            );
            
            textOutput.textContent = generatedText;
        } catch (error) {
            textOutput.textContent = `Error: ${error.message}`;
            textOutput.classList.add('error');
            console.error('Text generation error:', error);
        } finally {
            btn.disabled = false;
            btn.classList.remove('loading');
        }
    });
    
    // Image generation
    document.getElementById('generate-image-btn').addEventListener('click', async () => {
        const btn = this;
        btn.disabled = true;
        btn.classList.add('loading');
        imageStatus.textContent = 'Generating image...';
        
        try {
            const { imageData, generationTime } = await imageGenerator.generate(
                imagePrompt.value,
                parseInt(stepsSlider.value),
                parseFloat(guidanceSlider.value)
            );
            
            imageGenerator.renderToCanvas(imageData, 'image-output');
            imageStatus.textContent = `Generated in ${generationTime} seconds`;
        } catch (error) {
            imageStatus.textContent = `Error: ${error.message}`;
            imageStatus.classList.add('error');
            console.error('Image generation error:', error);
        } finally {
            btn.disabled = false;
            btn.classList.remove('loading');
        }
    });
    
    // Initialize everything
    updateSliderValues();
    lengthSlider.addEventListener('input', updateSliderValues);
    tempSlider.addEventListener('input', updateSliderValues);
    stepsSlider.addEventListener('input', updateSliderValues);
    guidanceSlider.addEventListener('input', updateSliderValues);
    
    await initModels();
});