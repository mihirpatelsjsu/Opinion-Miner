pipeline {
<<<<<<< HEAD
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
=======
    agent { dockerfile true }
    stages {
        stage('build') {
        	agent {
        		docker { image 'docker' }
        	}
            steps {
                sh 'docker version'
		sh 'docker images'
>>>>>>> 2b626ba123b9983ce4bad169a069726bb6cf4535
            }
        }
    }
}
