pipeline {
    agent { dockerfile true }
    stages {
        stage('build') {
        	agent {
        		docker { image: 'docker:19.03.8' }
        	}
            steps {
                sh 'docker version'
		sh 'docker images'
            }
        }
    }
}
