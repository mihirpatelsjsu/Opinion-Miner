pipeline {
    agent { dockerfile true }
    stages {
        stage('build') {
        	agent {
        		docker { image: 'docker' }
        	}
            steps {
                sh 'docker version'
		sh 'docker images'
            }
        }
    }
}
