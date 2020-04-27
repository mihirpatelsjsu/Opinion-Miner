pipeline {
    agent none
    stages {
        stage('build') {
        	agent {
        		docker { image: "docker" }
        	}
            steps {
                sh 'docker version'
				sh 'docker rm $(docker ps -a -q)'
				sh 'docker rmi $(docker images | grep opinionminer)'
        		sh 'docker build . -t opinionminer'
        		sh 'docker run -p 3000:3000 -d opinionminer'
            }
        }
    }
}