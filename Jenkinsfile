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
                // Added --passWithNoTests so the build doesn't fail if no tests exist yet
                sh 'npm test -- --passWithNoTests'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t smart-event-portal .'
            }
        }
    }
}