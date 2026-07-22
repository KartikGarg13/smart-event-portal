pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'kartik12325401/smart-event-portal'
        IMAGE_TAG = "v${env.BUILD_NUMBER}"
        CRED_ID = 'docker-hub-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/KartikGarg13/smart-event-portal.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test -- --passWithNoTests'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${env.DOCKER_IMAGE}:${env.IMAGE_TAG} ."
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${env.CRED_ID}") {
                        sh "docker push ${env.DOCKER_IMAGE}:${env.IMAGE_TAG}"
                        sh "docker tag ${env.DOCKER_IMAGE}:${env.IMAGE_TAG} ${env.DOCKER_IMAGE}:latest"
                        sh "docker push ${env.DOCKER_IMAGE}:latest"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh "sed -i 's|image: .*|image: ${env.DOCKER_IMAGE}:${env.IMAGE_TAG}|g' k8s/deployment.yaml"
                sh 'kubectl apply -f k8s/deployment.yaml --validate=false'
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'kubectl rollout status deployment/smart-event-portal-deployment'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully! Deployed to Kubernetes.'
        }
        failure {
            echo 'Pipeline failed! Automatically rolling back...'
            sh 'kubectl rollout undo deployment/smart-event-portal-deployment'
        }
    }
}