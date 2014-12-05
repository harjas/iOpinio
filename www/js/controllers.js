    var optionCounter=0; var uniquePhotoCount=0; var photos = []; var WickedIndex;  var options = [];
    var tImgID;
    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value

function onDeviceReady() {
    console.log("device is ready");
    StatusBar.hide();
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
    //document.addEventListener("pause", onPause, false);
    //document.addEventListener("resume", onResume, false);
    feedVisited=0; //a variable to control reloading the feed data.
     windowWidth = window.innerWidth;
     windowHeight = window.innerHeight;
     console.log("screen width is: "+windowWidth+", height is: "+windowHeight);
     deviceID=-1;
     theToken=-1;
     PUSHAPPS_APP_TOKEN="5ebcbd9a-8583-446e-81ee-f19e339fa88e";
     YOUR_GOOGLE_PROJECT_ID="75213574961";
   // console.log("destination type is: "+destinationType);
}

function option(){
  optionText="";
  containsImg=0;
  counterNum=-1;
}
function usernameObject(){
    name="";
    checked="false";
}
function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
}

function alreadyContains(arr, testVal){
    for(var i=0; i<arr.length; i++){
        if(arr[i].name==testVal)
            return true;
    }
    return false;
}

function parsenum(pnum){
    pnum = pnum.toString();
    var num = "";
    var count = 0;
    var i = pnum.length-1;

    while(count != 10){
        if(pnum.charAt(i) !== '-'){
            num = pnum.charAt(i)+ num;
            count++;
        }
        i--;
    }
    return num;
}  

angular.module('iOpinio.controllers', [])

    
    .controller('homeCtrl', function ($scope, $location) {

        ionic.Platform.ready(function() {
            // hide the status bar using the StatusBar plugin
            onDeviceReady();
            console.log("platform is ready");
            StatusBar.hide();
          });
        $scope.changeView = function(view){
            onDeviceReady();  //this shouldnt need to be here- REVIEW
            $location.path(view);
        }

          $scope.reportEvent = function(event)  {
            console.log('Reporting : ' + event.type);
            
            $timeout(function() {
              $scope.data[event.type]++;
            })
          }
    }) 

    .controller('registerPageCtrl', function($scope, $location, iOpinio){

        $scope.submitRegisterForm=function(){
            //onDeviceReady();
            console.log("register clicked");
            var g = $scope.Reggender;
            var ph = $scope.Regphonenumber;
            var em = $scope.Regemail;
            var u = $scope.Regusername;
            console.log("obtained username: "+u);
            var p = $scope.Regpassword;
            var a = $scope.Regage;
            var theToken=1;
            var deviceID=1;
            var deviceType=1;

            if(theToken!=-1&&deviceID!=-1){
                var deviceType=-1;
                    if(devicePlatform=="Android"){
                        deviceType=1;
                    }
                    else{
                        deviceType=2;
                    }
                var devicePlatform="chansky";
                if(em!='' && u!='' && p!=''&& deviceID!=''){
                    iOpinio.registerPost("https://web.engr.illinois.edu/~chansky2/register.php",{gender:g,phonenumber:ph,email:em,username:u,password:p,age:a,token:theToken,deviceID:deviceID,deviceType:deviceType}).success(function(res){
                        console.log("res at 0: "+res[0]+" ,res at 1: "+res[1]+ ", res at 2: "+res[2]);
                        if(res[2]=='t'){
                            console.log("inside the res==t");
                            $location.path("contactsPage");
                        }
                        console.log("return vals from register call: "+res);
                    }); 
                 /*   for(var i=0; i<20000; i++){
                        //do nothing
                        if(i==19999)
                            console.log("finished third round of doing nothing");
                    }
                    //window.alert(res);
                    //window.alert("outside of post");
                    console.log("outside of post");
                    */
                }  
                else{
                    window.alert("empty field(s)");
                }
            }
        }


    })

    .controller('sendToPageCtrl', function($scope, $location, iOpinio){
        console.log("in sendTo page");
        
         $scope.contacts = [];
        var fullNames= [];
        $scope.groupNames=[];

        iOpinio.get("https://web.engr.illinois.edu/~chansky2/buildGroup.php").success(function(resp){
            console.log("response is: "+resp);
            var obj = resp;            
            console.log("obj[i][gn]: "+obj[0]["gn"]);
            console.log("length of obj is: "+obj.length);
            //console.log("obj[i].gn: "+obj[i].gn);
            for(var i = 0; i < obj.length; i++) {
             // if(inArray(obj[i].gn, groupNames)==-1)  //to prevent duplicates
                console.log("obj at: "+i+" is: "+obj[i]["gn"]+"\n");
                $scope.groupNames.push(obj[i]["gn"]);     
            }
        });
        iOpinio.get("https://web.engr.illinois.edu/~chansky2/getFriends.php").success(function(data){
            var obj = data;
            console.log("get Friends obj: "+obj);
            console.log("obj[0]['username']: "+obj[0]["username"]);
            for(var i = 0; i < obj.length; i++) {
             // if(jQuery.inArray(obj[i].username, contacts)==-1)  //to prevent duplicates
                if(!alreadyContains($scope.contacts, obj[i]["username"])){
                    console.log("obj at: "+i+" is: "+obj[i]["username"]+"\n");
                    temp= new usernameObject();
                    temp.name=obj[i]["username"];
                    $scope.contacts.push(temp);     
                }
            }
        });  


         $scope.sendInfo =function(){
        var selected = [];
        var groupsSelected=[];
       /* $('#sendToCheckboxes input:checked').each(function() {
            selected.push($(this).attr('name'));
        });
    */
       // console.log("i can see contacts array is of length: "+$scope.contacts.length);
            for(var i=0; i<$scope.contacts.length; i++){
                console.log("val at "+i+" is: "+$scope.contacts[i].name);
                console.log("val at "+i+" is: "+$scope.contacts[i].checked);
                if($scope.contacts[i].checked==true)
                    selected.push($scope.contacts[i].name);
            }
    /*
        $('#groupNameCheckBoxes input:checked').each(function(){
            groupsSelected.push($(this).attr('name'));
        });
    */
           // console.log("1st group selected: "+groupsSelected[0]);
    //get info from local storage
        var info=(localStorage.getItem("allPollInfo"));
        var parsedInfo=JSON.parse(info);
        var et = parsedInfo["endTime"];  //weird ios only issue with this?
        var dt= parsedInfo["disappearTime"];
        var isInsta=parsedInfo["isInsta"];
        var options=parsedInfo["optionsArr"];
        var question=parsedInfo["question"];
        var photos=parsedInfo["photoArr"];
        console.log("example data, question: "+question);
        console.log("endtime: "+et);
        console.log("disappearTime: "+dt);
        console.log("options looks like this: "+options);
        console.log("parsed options looks like: "+JSON.stringify(options));
        var betterOptions=JSON.stringify(options);
        var betterReceivers = JSON.stringify(selected);
        var betterGroups = JSON.stringify(groupsSelected);
       // window.alert("your poll is being created!");
        iOpinio.post("https://web.engr.illinois.edu/~chansky2/addPollI.php",{question:question, num_options:options.length,
            options:betterOptions, insta:isInsta, endtime:et, disappearTime:dt, receivers:betterReceivers, receivingGroups:betterGroups}).success(function(res){
            //window.alert("res: "+res);
        //iOpinio.post("https://web.engr.illinois.edu/~chansky2/addPollI.php",parsedInfo).success(function(res){
            console.log("the output of the call to addPollI: "+res);
            var retVal=parseInt(res);
            //console.log("res at 0 is: "+res[0]);
            //console.log("res at 1 is: "+res[1]);
            //console.log("ret val is: "+retVal);
            $scope.uploadStuff(retVal, photos);
            localStorage.removeItem("allPollInfo");
            $location.path("createPoll");
            //window.location.hash="createPoll";
        }); 
      }

    $scope.uploadStuff =function(num, photos){
        console.log("in upload stuff (the function that uploads the photos)");
        console.log("photo length is: "+photos.length);
        var fileName="";
        var image=0;
        if(photos.length>0)
            image=1;
        if(image==1){
            for(var i=0; i<photos.length; i++){  
                fileName=photos[i];
                var uploadOptions = new FileUploadOptions();
                uploadOptions.fileKey="file";
                uploadOptions.fileName=num+".jpg";  //look at num
                console.log("pic file name: "+uploadOptions.fileName);
                uploadOptions.mimeType="image/jpg";
                uploadOptions.chunkedMode=false;
                //uploadOptions.correctOrientation= true;  //this didn't do anything
             //   uploadOptions.chunkedMode = true;  //new
                uploadOptions.headers = {Connection: "close"}; //new, this really helped android upload!
                var params = new Object();
                uploadOptions.params = params;
                var ft = new FileTransfer();
                ft.upload(fileName, encodeURI("https://web.engr.illinois.edu/~chansky2/uploadFile.php"), win, fail, uploadOptions, true);
                num++;
            }
        }
                    options=[]; photos=[];  //testing emptying   
    }  
          
    })

    .controller('loginPageCtrl', ['$scope', 'iOpinio', '$location', function($scope, iOpinio, $location){
        $scope.submitLogin = function(){
            var u = $scope.username;
            var p = $scope.password;
            console.log(u);
            console.log(p);
            if(u!='' && p!=''){
                iOpinio.create(u, p).success(function(res){ 
                    console.log("the db access returned: " +res);
                    if(res[1]==='t'){
                        $location.path("feedPage");  //this line is a f'n miracle     
                    }
                    else{
                      //  window.alert("incorrect username or password");
                        //$location.reload();
                    }
                }).error(function(d){
                    console.log("in error part");
                    console.log(d);
                });
            }
            else{
               // window.alert("username or password is missing");
                //location.reload();
            }
            return false;
        }
    }])

    .controller('mainCarouselCtrl', function($scope, $location, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, $stateParams) {
        console.log("in main carousel controller");
        
          //var delegate = $ionicScrollDelegate.$getByHandle('myScroll');

          if($stateParams.slidenum) {
            $timeout( function() {
              $scope.$broadcast('slideBox.setSlide', $stateParams.slidenum);
            }, 50);
          }

          $scope.dataSlide = {};
          $scope.dataSlide.currSlide = $ionicSlideBoxDelegate.currentIndex();

          $scope.slideChanged = function() {
            console.log("slide changed");
           // delegate.rememberScrollPosition('myScroll');
            $scope.dataSlide.currSlide = $ionicSlideBoxDelegate.currentIndex();

            $timeout( function() {
              $ionicScrollDelegate.resize();
            }, 50);
          };



    })

    .controller('feedPageCtrl', function($scope, $location, iOpinio){
         console.log('#personalFeed');
        $scope.usernames=[];
        $scope.PID=[];
        $scope.dataLength=0;
        $scope.endtime=[];
        $scope.timeRemaining=[];
        if(feedVisited==0){  //just added for control of reload
            console.log("feedVisited was 0 so we got data");
            getFeedData();
            feedVisited=1;
        } //just added for control of reload
        else{  //we already have feed data (and its in localStorage)
            var endtime=jQuery.parseJSON(localStorage.getItem("endtimeArr"));
            var usernames=jQuery.parseJSON(localStorage.getItem("userArr"));
            var timeRemaining=jQuery.parseJSON(localStorage.getItem("timeRemainingArr"));
            console.log("first endtime: "+endtime[0]);
            dataLength=usernames.length;
            displayFeed();
        }

       /* $('#feedList').delegate('li', 'vclick', function() {
            var index = $(this).index();
            var selectedIndex="selectedIndex";
            window.localStorage.setItem(selectedIndex, $(this).index());  //i added this semi colon july 9th
           console.log("Stopping timeCirlces and dataLength is: "+dataLength);
          for(var i=0; i<dataLength; i++){
            if(timeRemaining[i]>=0){
                var input="."+i;
                $(input).TimeCircles().stop();
            }
          }
            window.location.hash="chart";
        });  */
         $scope.refresh=function(){
            console.log("refreshing feed");
            console.log("Stopping timeCircles and dataLength is: "+$scope.dataLength);
            for(var i=0; i<$scope.dataLength; i++){
              if($scope.timeRemaining[i]>=0){
                    var input="."+i;
                    //$(input).TimeCircles().stop();
                }
            }
            //$('#feedList').empty();
            resetFeedArrays();
            getFeedData();            
        };

        function getFeedData(){
            iOpinio.get("https://web.engr.illinois.edu/~chansky2/personalFeed.php").success(function(data){
                console.log("data: "+data);
                            console.log("response is: "+data);
                            //console.log("parsed data: "+JSON.parse(data));
                            var obj = data;            
                           // console.log("obj[i][gn]: "+obj[0]["gn"]);
                            console.log("length of obj is: "+obj.length);
                            //console.log("obj[i].gn: "+obj[i].gn);
                            for(var i = 0; i < obj.length; i++) {
                             // if(inArray(obj[i].gn, groupNames)==-1)  //to prevent duplicates
                                console.log("obj at: "+i+" is: "+obj[i]["username"]+"\n");
                                //$scope.groupNames.push(obj[i]["gn"]);     
                            }
                if(data!= null && data!==undefined){    //VERY CRAPPY NULL CHECKER....
                    //var obj = JSON.parse( data );
                    for(var i = 0; i < obj.length; i++) {
                        $scope.usernames.push(obj[i].username);
                        $scope.PID.push(obj[i].PID);
                        $scope.endtime.push(obj[i].endtime);
                        $scope.timeRemaining.push(obj[i].timeRemaining);
                    }
                    dataLength=$scope.usernames.length;
                    displayFeed();
                    var userArr="userArr";
                    var endtimeArr="endtimeArr";
                    var p_idArr= "p_idArr";
                    var timeRemainingArr="timeRemainingArr";
                    if(typeof(window.localStorage) != 'undefined'){ 
                        window.localStorage.setItem(userArr, JSON.stringify($scope.usernames));
                        window.localStorage.setItem(endtimeArr, JSON.stringify($scope.endtime));
                        window.localStorage.setItem(p_idArr, JSON.stringify($scope.PID));
                        window.localStorage.setItem(timeRemainingArr, JSON.stringify($scope.timeRemaining));
                    } 
                    else{ 
                        console.log("store FAILED");
                        throw "window.localStorage, not defined"; 
                    }
                }
                else{
                    var word="NO FOLLOWERS";
                    console.log("no followers");
                   // $('#feedList').append('<li><a href="">' + word + '</a></li>').listview('refresh');
                }
            });  //this is clsing the get!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!    
        }

       /* function displayFeed(){
            console.log("displayFeed called");
            for (var j = 0; j < dataLength; j++) {   //not sure why this needs to be in the get
                var clock="display:inline-block; width:100%; height:20%;";
                var helperText="'s poll ends in: ";
                var timeDiff=timeRemaining[j];
                if(timeDiff<=0){
                    helperText="'s poll has ended (but can still be viewed)";
                }

                var phrase='<li><a><h2>'+usernames[j]+helperText+'</h2><div class="'+j+'", data-timer="'+timeDiff+'", style="'+clock+'"></div></a></li>';
                $('#feedList').append(phrase).listview('refresh');
                //add the time circle for each row:
                //console.log("endtime for item "+j+", is: "+endtime[j]);
                if(timeDiff>0){
                    var input="."+j;
                    $(input).TimeCircles({ "animation": "smooth",
                    "bg_width": 1.2,
                    "fg_width": 0.1,
                    "circle_bg_color": "#60686F", "count_past_zero": false, "time": {
                    "Days": {
                        "text": "Days",
                        "color": "#FFCC66",
                        "show": true
                    },
                    "Hours": {
                        "text": "Hours",
                        "color": "#99CCFF",
                        "show": true
                    },
                    "Minutes": {
                        "text": "Minutes",
                        "color": "#BBFFBB",
                        "show": true
                    },
                    "Seconds": {
                        "text": "Seconds",
                        "color": "#FF9999",
                        "show": true
                    }
                    }});
                }
                //$(input).TimeCircles({total_duration: "Minutes"}).rebuild();

            }
                            $('#feedList').trigger('create');

                $('#feedList').listview('refresh');
        } */

        function resetFeedArrays(){
            $scope.usernames=[];
            $scope.PID=[];
            $scope.dataLength=0;
            $scope.endtime=[];
            $scope.timeRemaining=[];
        }
        
    })


    .controller('createPollCtrl', function($scope, $location, $ionicModal){



$ionicModal.fromTemplateUrl('modal.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
    });  




      $scope.options=[]; 
      $scope.photos=[]; 
      $scope.timeOptions = [
          {time:'1 Minute'},
          {time:'5 Minutes'},
          {time:'10 Minutes'},
          {time:'30 Minutes'},
          {time:'1 Hour'},
          {time:'1 Day'},
          {time:'1 Week'}
      ];    

        $scope.add_option = function(){
            console.log("clicked add option");
           // var field=document.getElementById("add-option-text");
            console.log("yoooooo: "+$scope.addOptionText);
            tImgID="tmppic"+optionCounter;
            var option_text = $scope.addOptionText;
            var tempObj= new option();
            tempObj.optionText=option_text;
            tempObj.containsImg=0;
            tempObj.counterNum=optionCounter;       
            $scope.options.push(tempObj); 
          //  window.alert("option text: "+option_text);  
            if(option_text !== ''){
             //   $scope.optionsList.append('<li id="'+optionCounter+'"><div class="ui-grid-b"><div class="ui-block-a" style="width: 30%;"><div data-role="fieldcontain"><a id="'+optionCounter+'" href="#createPoll" class="btn btn-lg btn-success" data-toggle="modal" data-target="#basicModal"><span class="ui-btn-inner ui-btn-corner-all"><img style="width:60px;height:60px;" src="img/default_pic.png" id="'+tImgID+'"></span></a></div></div><div class="ui-block-b" style="width: 60%;"><div data-role="fieldcontain"><h2 id="otext">'+ option_text +'</h2></div></div><div class="ui-block-c" style="width: 6%; padding-top: 10px; float: right;"><div style="float: right;"><input type="button" id="remove-option-button" value="remove"/></div></div></div></li>').listview("refresh");          
               // $scope.addOptionText;
                optionCounter++;
            }
            else{
                //window.alert("Nothing to add!",function(){});
            }
            //$("#createPoll").trigger("create");
            //$scope.openModal();
            modal.show();
        }

        $scope.goToSendToPage = function(){
            console.log("clicked go to send to page");
            var isInsta= $scope.INSTABOX;
            if(!isInsta){
              isInsta="0";
            }
            var question = $scope.question;
            var selectedValue="null"
            if($scope.mytimeOptions!=null)
             selectedValue = $scope.mytimeOptions.time;
            console.log("selected time: "+selectedValue);

            var d = new Date();
            var seconds = d.getUTCSeconds();
            var minutes = d.getUTCMinutes();
            var hour = d.getUTCHours();
            var year = d.getUTCFullYear();
            var month = d.getUTCMonth()+1; // beware: January = 0; February = 1, etc.  //need +1 b/c of php
            var day = d.getUTCDate();
            //second set of these values for dissapear time
            var s, m, h, y, mo, d;
            y=year;
            mo=month;
            s=seconds;
            h=hour;
            m=minutes;
            d=day;
            var noTimePicked=0;
            if(selectedValue=="1 Minute"){
                minutes=minutes+1;
                m=minutes+1;
            }
            else if(selectedValue=="5 Minutes"){
                minutes=minutes+5;
                m=minutes+5;
            }
            else if(selectedValue=="10 Minutes"){
                minutes=minutes+10;
                m=minutes+10;
            }
            else if (selectedValue=="30 Minutes"){
                minutes=minutes+30;
                m=minutes+30;
            }
            else if (selectedValue=="1 Hour"){
                hour=hour+1;
                h=hour+1;
            }
            else if (selectedValue=="1 Day"){
                day=day+1;
                d=day+1;
            }
            else if (selectedValue=="1 Week"){
                day=day+7;
                d=day+7
            }
            else{
                noTimePicked=1;
            }
            //seems like the below should only happen if no time picked is still equal to 0...
            if(minutes>=60){
              minutes=minutes%60;
              hour=hour+1;
            }
            if(m>=60){
              m=m%60;
              h=h+1;
            }
            if(hour>=24){
              hour=hour%24;
              day=day+1;
            }
            if(h>=24){
              h=h%24;
              d=d+1;
            }
            if(day>daysInMonth(month,year)){
              day=day-daysInMonth(month,year);
              month=month+1;
            }
            if(d>daysInMonth(mo, y)){
              d=d-daysInMonth(mo, y);
              mo=mo+1;
            }
            if(month>11){
              month=0;
              year=year+1;
            }
            if(mo>11){
              mo=0;
              y=y+1;
            }
            if(month<10){  //need this to make php and sql happy
                month="0"+month;
            }
            if(m<10){
              m="0"+m;
            }
           var et="";
           var dt="";
           if(noTimePicked!=1){
                var et=year+"-"+month+"-"+day+" "+hour+":"+minutes+":"+seconds;
                var dt=y+"-"+mo+"-"+d+" "+h+":"+m+":"+s;
            }
            var allPollInfo={'endTime': et, 'optionsArr':$scope.options, 'isInsta': isInsta, 'question': question, 'photoArr': photos, 'disappearTime':dt};
            if(typeof(window.localStorage) != 'undefined'){ 
                console.log('storing local data');
                window.localStorage['allPollInfo']= JSON.stringify(allPollInfo);
            } 
            else{ 
                window.alert("storage failed...");
                console.log("store FAILED");
                throw "window.localStorage, not defined"; 
            }
            optionCounter=0;
            //options=[];  //testing empty  
            //photos=[];  //testing empty
            $location.path("sendToPage");
        }


        /*
        $('#options-list').on('click', '#remove-option-button', function(event) {
            console.log("remove clicked on");
            tImgID="tmppic"+(optionCounter);  //used to be -1
            event.preventDefault();
            var removalIndex=$(this).parent().parent().parent().parent().attr('id');
            console.log("removing (aka removal index): "+removalIndex+", and optionCounter is: "+optionCounter);
            console.log("options size before remove: "+options.length);
            //im thinking if i add a for loop to go through the options array and find the option with the 
            //matching id then thats my true removal index!
            var trueRemovalIndex=-1;
            for(var i=0; i<options.length; i++){
                if(options[i].counterNum==removalIndex)
                    trueRemovalIndex=i;
            }
            console.log("true removal index is: "+trueRemovalIndex);
            options.splice(trueRemovalIndex, 1);  //actually removes the option from the options array
           // optionCounter--;  //this is bad because it leads to li's with the same id
            console.log("options size after removal: "+options.length+" and optionCounter is: "+optionCounter);
            console.log("photos length is: "+photos.legnth+", and uniquePhotoCount is: "+uniquePhotoCount);
            var i=0;
            var helperFlag=0;
            for(var x in photos){
                    if(photos.hasOwnProperty(x)){
                        if(i==trueRemovalIndex)
                            helperFlag=1;
                        i++;
                    }
            }
            console.log("the length of photos pre-remove is: "+i);
            if(helperFlag==1){
                photos.splice(trueRemovalIndex, 1);
                //delete photos[trueRemovalIndex];
                uniquePhotoCount--;
                console.log("new length of photos is: "+photos.length);
            }

           $(this).parent().parent().parent().parent().remove();

        });  */

    })



    .controller('contactsPageCtrl', function($scope, $location, iOpinio){
        console.log('contacts Page');
        var contactOptions = new ContactFindOptions();   //this used to be var options =... but i changed it
        contactOptions.filter = "";
        contactOptions.multiple = true;
        var fields = ["displayName","phoneNumbers"];
        console.log("about to call find contacts");
        navigator.contacts.find(fields, onSuccess, onError, contactOptions);      
        var loaded = false;
        var pnums = [];  

        function onSuccess(contacts) {
            console.log("Success, found contacts");
            for(var i=0; i<contacts.length; i++){
                if(contacts[i].displayName){
                    if(contacts[i].phoneNumbers != null){
                        for(var j=0; j<contacts[i].phoneNumbers.length; j++){
                            pnums.push(parsenum(contacts[i].phoneNumbers[j].value));
                        }
                    }
                }
            }

            $scope.usernames = [];
            console.log("about to make the post request part of find contacts");
            pnums=JSON.stringify(pnums);
             iOpinio.phoneNumbersPost("https://web.engr.illinois.edu/~chansky2/findContacts.php",{phonenumbers:pnums}).success(function(res){
               console.log("find contacts php returned: "+res[0].username);
               if(res!="No"){  //never have tested this case (i'd need a phone who doesn't have my #)
                  //  var obj = JSON.parse(res);   //or i'd have to remove my # from the DB
                    var obj=res;
                    for(var i=0; i<obj.length; i++){
                        if(!alreadyContains($scope.usernames, obj[i].username)){
                            console.log(obj[i].username);
                            temp= new usernameObject();
                            temp.name=obj[i].username;
                            $scope.usernames.push(temp);
                        }
                    }  
                }
                else{
                    $location.path("createPoll");   //change back!!!!!!!!
                }
             });
        }
        function onError(contacts){
            console.log("WTF");
            console.log(contacts);
        }  

        $scope.follow=function(){
            var selected = [];
            for(var i=0; i<$scope.usernames.length; i++){
                console.log("val at "+i+" is: "+$scope.usernames[i].name);
                console.log("val at "+i+" is: "+$scope.usernames[i].checked);
                if($scope.usernames[i].checked==true)
                    selected.push($scope.usernames[i].name);
            }
            //window.alert(selected);
            selected=JSON.stringify(selected);
            iOpinio.followPost("https://web.engr.illinois.edu/~chansky2/followContacts.php",{type:"follow", usernames:selected}).success(function(res){
                //window.alert(res);
                //window.location = "createPoll.html";
                $location.path("createPoll");
            });
            //and also sign up to receive thier notifications (by default)
         /*   $.post("https://web.engr.illinois.edu/~chansky2/addInsta.php",{type:"add", usernames:selected},function(res){
                //window.alert(res);
               $location.path("createPoll");
            });  */
        }
        $scope.skip=function(){
            $location.path("createPoll");
        }         
    })

    .directive('detectGestures', function($ionicGesture) {
  return {
    restrict :  'A',

    link : function(scope, elem, attrs) {
      var gestureType = attrs.gestureType;

      switch(gestureType) {
        case 'swipe':
          $ionicGesture.on('swipe', scope.reportEvent, elem);
          break;
        case 'swiperight':
          $ionicGesture.on('swiperight', scope.reportEvent, elem);
          console.log("swiped right");
          break;
        case 'swipeleft':
          $ionicGesture.on('swipeleft', scope.reportEvent, elem);
          break;
        case 'doubletap':
          $ionicGesture.on('doubletap', scope.reportEvent, elem);
          break;
        case 'tap':
          $ionicGesture.on('tap', scope.reportEvent, elem);
          break;
      }

    }
  }
});


    //modal stuff below

