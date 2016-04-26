(function(){
  var quizathon = angular.module("quizathon", []);

  quizathon.controller("quizathonCtrl", function () {
    var quiz = this;
    quiz.currentShownId = 0;
    var jsonObj = [
      {
        id: 1,
        q: "What is your favorite color",
        opts:  [
          {
            id: 1,
            val:"Red"
          },
          {
            id: 2,
            val: "Blue"
          },
          {
            id: 3,
            val: "Green"
          },
          {
            id: 4,
            val: "Yellow"
          }
        ],
        diff: 2
      },
      {
        id: 2,
        q: "Why is the sky blue",
        opts: [
          {
            id: 1,
            val: "I don't know"
          },
          {
            id: 2,
            val: "I don't care"
          },
          {
            id: 3,
            val: "I like Red"
          },
          {
            id: 4,
            val: "Its complicated"
          }
        ],
        diff: 9
      },
      {
        id: 5,
        q: "When does it rain",
        opts: [
          {
            id: 1,
            val: "I don't know"
          },
          {
            id: 2,
            val: "I don't care"
          },
          {
            id: 3,
            val: "Whenever it likes"
          },
          {
            id: 4,
            val: "Its complicated"
          }
        ],
        diff: 8
      }

    ];
    quiz.hello = "Hello World";
    quiz.questions = jsonObj;

    quiz.slideIt = function(forward) {
      if(forward) {
        quiz.currentShownId++;
      } else {
        quiz.currentShownId--;
      }
    }
  });
})();
