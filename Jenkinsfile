pipeline {
    agent { docker { image 'node:12-alpine' } }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
                sh 'npm install'
            }
        }
        stage('deploy') {
        	steps {
        		sh 'docker stop $(docker ps -a -q)'
				sh 'docker rm $(docker ps -a -q)'
				sh 'docker rmi $(docker images | grep opinionminer)'
        		sh 'docker build . -t opinionminer'
        		sh 'docker run -p 3000:3000 -d opinionminer'
        	}
        }
    }
}