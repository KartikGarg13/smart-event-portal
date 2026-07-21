cat << 'EOF' > Jenkinsfile
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.image("your-dockerhub-username/smart-event-portal:${env.BUILD_NUMBER}")
                    dockerImage.build()
                }
            }
        }
    }
}
EOF