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

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                if [ -f package.json ]; then
                    npm test || true
                fi
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
                docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${CRED_ID}",
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh """
                docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                docker push ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh """
                kubectl set image deployment/smart-event-portal-deployment \
                smart-event-portal=${DOCKER_IMAGE}:${IMAGE_TAG}

                kubectl rollout status deployment/smart-event-portal-deployment
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                kubectl get deployments
                kubectl get pods
                kubectl get services
                '''
            }
        }
    }

    post {

    success {
        echo '========================================='
        echo ' CI/CD Pipeline Completed Successfully!'
        echo " Docker Image: ${DOCKER_IMAGE}:${IMAGE_TAG}"
        echo ' Kubernetes Deployment Updated'
        echo '========================================='
    }

    failure {
        echo '========================================='
        echo ' Pipeline Failed!'
        echo ' Rolling back Kubernetes Deployment...'
        echo '========================================='

        sh '''
        kubectl rollout undo deployment/smart-event-portal-deployment
        kubectl rollout status deployment/smart-event-portal-deployment
        '''
    }

    always {
        sh 'docker image prune -f || true'
    }
}
    
}