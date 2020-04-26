pipeline {
	agent { dockerfile true }
    stages {
        stage('build') {
            steps {
                sh 'curl http://localhost:3000/'
            }
        }
    }
}
