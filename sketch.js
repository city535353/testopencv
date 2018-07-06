// Copyright (c) 2018 ml5
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ML5 Example
KNN_Image
KNN Image Classifier example with p5.js
=== */

let knn;
let video;

function setup() {
  noCanvas();
  
// 定義要取得的影音內容，包含影像和聲音
let constraints = {
  audio: false,
  video: { facingMode: { exact: "environment" } }
}
  
let inputVideo = document.querySelector('#inputVideo')

navigator.mediaDevices.getUserMedia(constraints)
  .then(function (stream) {
    inputVideoURL = URL.createObjectURL(stream)
    inputVideo.src = inputVideoURL
    inputVideo.controls = false       // 要不要顯示播放控制器
  })
  .catch(function (error) {
    console.warn('some error occurred' + error)
  });
  
inputVideo.play();
  
  /* Create a KNN Image Classifier
  KNNImageClassifier(?numClasses, ?knnKValue, callback, ?video)
  
  callback - A function to run once the model has been loaded.

  numClasses - The number of classes to be able to detect. Optional, defaults to 15.

  knnKValue - The number of nearest neighbors to look at when predicting. Optional, defaults to 5.

  video - A HTMLVideoElement
  
  */
  
  
  
//  videodom = createCapture(VIDEO).parent('videoContainer');

  knn = new ml5.KNNImageClassifier(2, 1, modelLoaded, inputVideo);
  createButtons();
}

function createButtons() {
  // Save and Load buttons
  save = select('#save');
  save.mousePressed(function() {
    knn.save('test');
  });

 load = select('#load');
 load.mousePressed(function() {
    knn.load('KNN-preload.json', updateExampleCounts);
  });


  // Train buttons
  buttonA = select('#buttonA');
  buttonA.mousePressed(function() {
    train(1);
  });

  buttonB = select('#buttonB');
  buttonB.mousePressed(function() {
    train(2);
  });

  // Reset buttons
  resetBtnA = select('#resetA');
  resetBtnA.mousePressed(function() {
    clearClass(1);
    updateExampleCounts();
  });

  resetBtnB = select('#resetB');
  resetBtnB.mousePressed(function() {
    clearClass(2);
    updateExampleCounts();
  });

  // Predict Button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(predict);
}

// A function to be called when the model has been loaded
function modelLoaded() {
  select('#loading').html('Model loaded!');
}

// Train the Classifier on a frame from the video.
function train(category) {
  let msg;
  if (category == 1) {
    msg = 'A';
  } else if (category == 2) {
    msg = 'B';
  }
  select('#training').html(msg);
  knn.addImageFromVideo(category);
  updateExampleCounts();
}

// Predict the current frame.
function predict() {
  knn.predictFromVideo(gotResults);
}

// Show the results
function gotResults(results) {
  let msg;

  if (results.classIndex == 1) {
    msg = 'A';
  } else if (results.classIndex == 2) {
    msg = 'B';
  }
  select('#result').html(msg);

  // Update confidence
  select('#confidenceA').html(results.confidences[1]);
  select('#confidenceB').html(results.confidences[2]);

  setTimeout(function(){
    predict();
  }, 50);
}

// Clear the data in one class
function clearClass(classIndex) {
  knn.clearClass(classIndex);
}

// Update the example count for each class
function updateExampleCounts() {
  let counts = knn.getClassExampleCount();
  select('#exampleA').html(counts[1]);
  select('#exampleB').html(counts[2]);
}