pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "kartik12325401/smart-event-portal"
        IMAGE_TAG = "v${BUILD_NUMBER}"
        CRED_ID = "docker-hub-credentials"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/KartikGarg13/smart-event-portal.git'
            }
        }

        stage('Verify Environment') {
            steps {
                sh '''
                    echo "Node Version:"
                    node -v
                    echo "NPM Version:"
                    npm -v
                    echo "Docker Version:"
                    docker --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test || true'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
                    docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest
                '''
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${CRED_ID}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh '''
                    docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                    docker push ${DOCKER_IMAGE}:latest
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker rm -f smart-event-portal || true
                    docker run -d \
                    --name smart-event-portal \
                    -p 3000:3000 \
                    ${DOCKER_IMAGE}:${IMAGE_TAG}
                '''
            }
        }
    }

    post {
        always {
            cleanWs()
        }

        success {
            echo 'Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed!'
        }
    }
}