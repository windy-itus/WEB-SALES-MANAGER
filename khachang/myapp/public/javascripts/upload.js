
function Upload()
{
    
    var image=document.getElementById("image").files[0];
    var imagename=image.name;
    var storageRef=firebase.storage().ref('Image1/'+imagename);
    var uploadtask=storageRef.put(image);

    uploadtask.on('state_changed',function(snapshot){
        var progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
        console.log("upload is" + progress + "done");
    }, function(error){
        console.log(error.message);
    },function(){
        uploadtask.snapshot.ref.getDownloadURL().then(function(downloadURL){
            console.log(downloadURL);
        })
    });
}
