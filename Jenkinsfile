pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '-u root'
        }
    }

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
                sh 'npm test --if-present'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Note: This requires Docker-in-Docker if building nested containers, 
                // but for testing the pipeline flow, let's make sure npm passes first!
                echo 'Skipping inner docker build for container agent, or run standard sh command if supported.'
            }
        }
    }
}