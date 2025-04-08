// Load projects dynamically
document.addEventListener('DOMContentLoaded', function() {
    // Skills Chart
    const ctx = document.getElementById('skillsChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Python', 'TensorFlow/PyTorch', 'Computer Vision', 'NLP', 'MLOps', 'Mathematics'],
            datasets: [{
                label: 'Skill Level',
                data: [90, 85, 80, 75, 70, 85],
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(79, 70, 229, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });

    // Load projects from JSON (could be fetched from GitHub API)
    const projects = [
        {
            title: "Image Classification Model",
            description: "CNN model trained on CIFAR-10 with 92% accuracy",
            tags: ["Python", "PyTorch", "Computer Vision"],
            link: "#",
            image: "assets/images/project1.jpg"
        },
        {
            title: "Text Summarization",
            description: "Transformer-based model for abstractive text summarization",
            tags: ["NLP", "HuggingFace", "Transformers"],
            link: "#",
            image: "assets/images/project2.jpg"
        },
        {
            title: "Anomaly Detection",
            description: "Unsupervised learning for detecting anomalies in time-series data",
            tags: ["TensorFlow", "Autoencoders", "Time Series"],
            link: "#",
            image: "assets/images/project3.jpg"
        }
    ];

    const projectsContainer = document.getElementById('projectsContainer');
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="tags">
                    ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
                <a href="${project.link}" class="project-link">View Project</a>
            </div>
        `;
        projectsContainer.appendChild(projectCard);
    });

    // Image classification demo
    document.getElementById('imageUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.getElementById('imageCanvas');
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    // Simulate model prediction (in a real app, you'd run an actual model)
                    setTimeout(() => {
                        const results = [
                            {label: "Dog", confidence: 0.87},
                            {label: "Cat", confidence: 0.12},
                            {label: "Bird", confidence: 0.01}
                        ];
                        
                        let html = "<h4>Prediction Results:</h4><ul>";
                        results.forEach(result => {
                            html += `<li>${result.label}: ${(result.confidence * 100).toFixed(1)}%</li>`;
                        });
                        html += "</ul>";
                        
                        document.getElementById('imageResults').innerHTML = html;
                    }, 1000);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});

// Sentiment analysis demo
async function analyzeSentiment() {
    const text = document.getElementById('sentimentText').value;
    if (!text.trim()) return;
    
    document.getElementById('sentimentResult').innerHTML = "<p>Analyzing...</p>";
    
    // In a real implementation, you would:
    // 1. Load an ONNX model (see below)
    // 2. Preprocess the text
    // 3. Run inference
    
    // Simulate API call
    setTimeout(() => {
        const sentiment = Math.random() > 0.5 ? "Positive" : "Negative";
        const confidence = (Math.random() * 0.5 + 0.5).toFixed(2);
        
        document.getElementById('sentimentResult').innerHTML = `
            <div class="sentiment-result ${sentiment.toLowerCase()}">
                <h4>Sentiment: ${sentiment}</h4>
                <p>Confidence: ${confidence}</p>
            </div>
        `;
    }, 1500);
}

/* 
For actual model deployment in the browser:
1. Convert your PyTorch/TensorFlow model to ONNX format
2. Place the .onnx file in your assets folder
3. Use ONNX Runtime Web like this:

async function loadModel() {
    const session = await ort.InferenceSession.create('assets/models/sentiment.onnx');
    return session;
}

async function runSentimentAnalysis(text) {
    const session = await loadModel();
    // Preprocess text to tensor
    const inputTensor = new ort.Tensor('float32', new Float32Array([...]), [1, sequenceLength]);
    const outputs = await session.run({input: inputTensor});
    return outputs;
}
*/