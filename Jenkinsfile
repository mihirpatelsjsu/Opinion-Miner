pipeline {
	agent { dockerfile true }
    stages {
        stage('build') {
		agent {
			image: docker
		}
            steps {
                sh 'docker version'
		sh 'docker images'
            }
        }
    }
}
