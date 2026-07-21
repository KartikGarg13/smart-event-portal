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
                // Uses node tool, or runs npm if node is available globally/in agent
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
                sh 'docker build -t smart-event-portal .'
            }
        }
    }
}