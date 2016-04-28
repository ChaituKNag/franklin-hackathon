(function(){
  var quizathon = angular.module("quizathon", []);

  quizathon.controller("quizathonCtrl", function () {
    var quiz = this;
    quiz.currentShownId = 0;
    quiz.authenticated = true;
    var jsonObj = [
      {
        id: 1,
        q: "What is the color of the pic you see below",
        qType: "img",
        imgPath: "/images/questions/placeholder.png",
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
        qType: "normal",
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
        qType: "normal",
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
        diff: 5
      },
      {
        id: 1,
        q: "What is the color of the pic you see below",
        qType: "img",
        imgPath: "/images/questions/placeholder.png",
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
        qType: "normal",
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
        qType: "normal",
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
        diff: 5
      },
      {
        id: 1,
        q: "What is the color of the pic you see below",
        qType: "img",
        imgPath: "/images/questions/placeholder.png",
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
        qType: "normal",
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
        qType: "normal",
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
        diff: 5
      },
      {
        id: 5,
        q: "When does it rain",
        qType: "normal",
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
        diff: 5
      }

    ];
    quiz.hello = "Hello World";
    quiz.questions = jsonObj;

    quiz.slideIt = function(forward) {
      if(forward && quiz.currentShownId < quiz.questions.length-1) {
        quiz.currentShownId++;
        //console.log("Current index: " + quiz.currentShownId);
      }
      else if(!forward && quiz.currentShownId > 0) {
        quiz.currentShownId--;
        //console.log("Current index: " + quiz.currentShownId);
      }
    }
  });
})();
