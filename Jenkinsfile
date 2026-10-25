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
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" test/test.sh'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build --build-arg GIT_SHA=%GIT_COMMIT% -t rental360:%BUILD_NUMBER% .'
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
