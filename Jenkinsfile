pipeline {
    agent any

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
                sh 'docker build -t smart-event-portal .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop smart-event-portal-app || true
                    docker rm smart-event-portal-app || true
                    docker run -d -p 3000:3000 --name smart-event-portal-app smart-event-portal
                '''
            }
        }
    }
}