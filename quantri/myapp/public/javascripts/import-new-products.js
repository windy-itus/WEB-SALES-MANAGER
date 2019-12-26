var firebaseConfig = {
    apiKey: "AIzaSyB3C7OOUgjjxf7yvV9P6VbmtHmDGKVBCeA",
    authDomain: "stotepicture.firebaseapp.com",
    databaseURL: "https://stotepicture.firebaseio.com",
    projectId: "stotepicture",
    storageBucket: "stotepicture.appspot.com",
    messagingSenderId: "160343356649",
    appId: "1:160343356649:web:b433527c5cf3c68d46ac78",
    measurementId: "G-228F3ECR6Q"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

var selectedFile;
function getfile() {
    var pic = document.getElementById("photo");

    // selected file is that file which user chosen by html form 
    selectedFile = pic.files[0];

    // make save button disabled for few seconds that has id='submit_link' 
    myfunction(); // call below written function 
}

function myfunction() {
    // select unique name for everytime when image uploaded 
    // Date.now() is function that give current timestamp 
    var name = "123" + Date.now();

    // make ref to your firebase storage and select images folder 
    var storageRef = firebase.storage().ref('/images/' + name);

    // put file to firebase  
    var uploadTask = storageRef.put(selectedFile);

    // all working for progress bar that in html 
    // to indicate image uploading... report 
    uploadTask.on('state_changed', function (snapshot) {
        var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        var uploader = document.getElementById('process');
        uploader.value = progress;
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING:
                console.log('Upload is running');
                break;
        }
    }, function (error) {
        console.log(error);
    }, function () {

        // get the uploaded image url back 
        uploadTask.snapshot.ref.getDownloadURL().then(
            function (downloadURL) {
                console.log(downloadURL);

                // You get your url from here 
                //console.log('File available at', downloadURL);
                document.getElementById('url').value = downloadURL;
                $('#image').attr("src", downloadURL);

                // alert(document.getElementById('url').value);
                // print the image url  
                console.log(downloadURL);
                document.getElementById('submit_link').removeAttribute('disabled');
            });
    });
};