pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                bat 'call npm.cmd --prefix backend ci'
                bat 'call npm.cmd --prefix frontend ci'
                bat 'call npm.cmd --prefix backend test'
                bat 'call npm.cmd --prefix frontend run build'
                bat 'node test\\test.js'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build --build-arg GIT_SHA=%GIT_COMMIT% -t rental360:%BUILD_NUMBER% .'
                bat 'docker build -t rental360-frontend:%BUILD_NUMBER% frontend'
            }
        }
    }

    post {
        success {
            echo 'Tests passed and Docker image built successfully.'
        }
        failure {
            echo 'Pipeline failed. Check the stage logs.'
        }
    }
}
