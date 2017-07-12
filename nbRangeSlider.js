(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['nbRangeSlider'], factory);
    } else {
        // Browser globals
        root.nbRangeSlider = factory(root.options);
    }
}(window, function(options) {

    var nbRangeSlider = {

        rangeMinVal : 0,

        rangeMaxVal : 0,

        righthandleI : 0,

        lefthandleI : 0,

        params : null,

        nbRangeRatio : 1,

        nbRangeSliderWidth : 0,

		initialize : function(options){
			var self = this;
			self.params = options;
            self.rangeMinVal = options.min;
            self.rangeMaxVal = options.max;
            var stepCount = 0;
            var stepTotal = 0;
            var lastStepEnd = 0;
            var stepsArray = [];
            stepsArray.push(0);
            for(var i=0;i<options.steps.length;i++){
                stepCount = stepCount + ((options.steps[i].end - lastStepEnd)/options.steps[i].diff);
                for(var j=0;j<((options.steps[i].end - lastStepEnd)/options.steps[i].diff);j++){
                    stepTotal = stepTotal + options.steps[i].diff;
                    stepsArray.push(stepTotal);
                }
                lastStepEnd = options.steps[i].end;
            }
            self.righthandleI = stepCount;
            $(".nbRangeSlider").html("<div class='nb-range-drag'>"+
                "<div class='nb-range-handle'>"+
                "</div>"+
                "<div class='nb-left-handle' draggable='false'>"+
                "</div>"+
                "<div class='nb-right-handle' draggable='false'>"+
                "</div>"+
                "<div class='nb-range-background'>"+
                "</div>"+
            "</div>"+
            "<div class='nb-range-input'>"+
                "<div class='nb-range-input-min'><p>&#8377;</p> "+
                    "<input type='text'>"+
                    "<span></span>"+
                "</div>"+
                "<div class='nb-range-input-max'>&#8377; "+
                    "<input type='text'>"+
                    "<span></span>"+
                "</div>"+
            "</div>");

            var rightHandleSelected = false;
            var leftHandleSelected = false;
            var leftHandlePos = 0;
            var rightHandlePos = $(".nbRangeSlider").width();
            var leftInputFocus = false;
            var rightInputFocus = false;

            $(".nb-right-handle").on("mouseup", function(){
                rightHandleSelected = false;
                options.handler({"minVal" : self.rangeMinVal, "maxVal" : self.rangeMaxVal});
            });

            $(".nb-right-handle").on("mousedown", function(){
                rightHandleSelected = true;
            });

            $(".nb-left-handle").on("mouseup", function(){
                leftHandleSelected = false;
                options.handler({"minVal" : self.rangeMinVal, "maxVal" : self.rangeMaxVal});
            });

            $(".nb-left-handle").on("mousedown", function(){
                leftHandleSelected = true;
            });
            $(".nb-range-input-min > input").val(self.rangeMinVal);
            $(".nb-range-input-max > input").val(self.rangeMaxVal);
            $(".nb-range-input-max > span").html(rupeeFormat(self.rangeMaxVal));
            $(".nb-range-input-min > span").html(rupeeFormat(self.rangeMinVal));
            self.nbRangeSliderWidth = $(".nbRangeSlider").width();
            self.nbRangeRatio = self.nbRangeSliderWidth/stepCount;
            $(".nb-range-drag").on("mousemove", function(e){
                var cursorX = e.pageX - $(".nb-range-drag").offset().left;
                if(cursorX >=0  && cursorX <= $(".nbRangeSlider").width()){
                    self.nbRangeRatio = $(".nbRangeSlider").width()/stepCount;
                    if(rightHandleSelected && cursorX >= leftHandlePos){
                        self.righthandleI = Math.round(cursorX/self.nbRangeRatio);
                        rightHandlePos = self.righthandleI*self.nbRangeRatio;
                        $(".nb-right-handle").css({"left" : (rightHandlePos - 12) + "px"});
                        $(".nb-range-handle").css({"width" : (rightHandlePos - leftHandlePos) + "px"});
                        $(".nb-range-input-max > span").html(rupeeFormat(stepsArray[self.righthandleI]));
                        self.rangeMaxVal = stepsArray[self.righthandleI];
                    }
                    if(leftHandleSelected && cursorX <= rightHandlePos){
                        self.leftHandleI = Math.round(cursorX/self.nbRangeRatio);
                        leftHandlePos = self.leftHandleI*self.nbRangeRatio;
                        $(".nb-left-handle").css({"left" : (leftHandlePos - 12) + "px"});
                        $(".nb-range-handle").css({"width" : (rightHandlePos - leftHandlePos) + "px", "left" : cursorX + "px"});
                        $(".nb-range-input-min > span").html(rupeeFormat(stepsArray[self.leftHandleI]));
                        self.rangeMinVal = stepsArray[self.leftHandleI];
                    }
                }
            });

            $(".nb-range-drag").click(function(e){
                var cursorX = e.pageX - $(".nb-range-drag").offset().left;
                if(cursorX >=0  && cursorX <= $(".nbRangeSlider").width()){
                    var midPos = ($(".nb-range-handle").width()/2) + leftHandlePos;
                    if(cursorX > midPos){
                        self.righthandleI = Math.round(cursorX/self.nbRangeRatio);
                        rightHandlePos = self.righthandleI*self.nbRangeRatio;
                        $(".nb-right-handle").css({"left" : (rightHandlePos - 12) + "px"});
                        $(".nb-range-handle").css({"width" : (rightHandlePos - leftHandlePos) + "px"});
                        $(".nb-range-input-max > span").html(rupeeFormat(stepsArray[self.righthandleI]));
                        self.rangeMaxVal = stepsArray[self.righthandleI];
                    }
                    else{
                        self.leftHandleI = Math.round(cursorX/self.nbRangeRatio);
                        leftHandlePos = self.leftHandleI*self.nbRangeRatio;
                        $(".nb-left-handle").css({"left" : (leftHandlePos - 12) + "px"});
                        $(".nb-range-handle").css({"width" : (rightHandlePos - leftHandlePos) + "px", "left" : cursorX + "px"});
                        $(".nb-range-input-min > span").html(rupeeFormat(stepsArray[self.leftHandleI]));
                        self.rangeMinVal = stepsArray[self.leftHandleI];
                    }
                    options.handler({"minVal" : self.rangeMinVal, "maxVal" : self.rangeMaxVal});
                }
            });

            $(document).on("mouseup", function(e){
                rightHandleSelected = false;
                leftHandleSelected = false;
            });

            $(".nb-range-input-max > input").focus(function(){
                rightInputFocus = true;
            });

            $(".nb-range-input-max > input").blur(function(){
                rightInputFocus = false;
                setRightHandle();
                $(this).next("span").css({"display":"inline-block"});
                $(this).next("span").html(rupeeFormat(self.rangeMaxVal));
            });

            $(".nb-range-input-min > input").focus(function(){
                leftInputFocus = true;
            });

            $(".nb-range-input-min > input").blur(function(){
                leftInputFocus = false;
                setLeftHandle();
                $(this).next("span").css({"display":"inline-block"});
                $(this).next("span").html(rupeeFormat(self.rangeMinVal));
            });

            $(".nb-range-input-min > span").click(function(){
                $(this).hide();
                $(this).prev("input").val(self.rangeMinVal);
                $(this).prev("input").focus();
            });

            $(".nb-range-input-max > span").click(function(){
                $(this).hide();
                $(this).prev("input").val(self.rangeMaxVal);
                $(this).prev("input").focus();
            });

            $(document).keydown(function(e) {
                if(e.which == 13){
                    if(rightInputFocus){
                        setRightHandle();
                        options.handler({"minVal" : self.rangeMinVal, "maxVal" : self.rangeMaxVal});
                    }
                    if(leftInputFocus){
                        setLeftHandle();
                        options.handler({"minVal" : self.rangeMinVal, "maxVal" : self.rangeMaxVal});
                    }
                }
            });

            function setRightHandle(){
                var i;
                var inputValue = $(".nb-range-input-max > input").val();
                for(i=0;i< stepsArray.length;i++){
                    if(inputValue == stepsArray[i] || (inputValue > stepsArray[i] &&  inputValue < stepsArray[i+1])){
                        break;
                    }
                }
                var addRightPos = 0;
                if(inputValue - stepsArray[i] > 0){
                    addRightPos = self.nbRangeRatio*((inputValue - stepsArray[i])/(stepsArray[i+1] - stepsArray[i]))
                }
                rightHandlePos = (i*self.nbRangeRatio) + addRightPos;
                $(".nb-right-handle").css({"left" : (rightHandlePos - 12) + "px"});
                $(".nb-range-handle").css({"width" : (rightHandlePos - leftHandlePos) + "px"});
                $(".nb-range-input-max > input").val(inputValue);
                $(".nb-range-input-max > span").html(rupeeFormat(inputValue));
                self.rangeMaxVal = inputValue;
            }

            function setLeftHandle(){
                var i;
                var inputValue = $(".nb-range-input-min > input").val();
                for(i=0;i< stepsArray.length;i++){
                    if(inputValue == stepsArray[i] || (inputValue > stepsArray[i] &&  inputValue < stepsArray[i+1])){
                        break;
                    }
                }
                var addLeftPos = 0;
                if(inputValue - stepsArray[i] > 0){
                    addLeftPos = self.nbRangeRatio*((inputValue - stepsArray[i])/(stepsArray[i+1] - stepsArray[i]))
                }
                leftHandlePos = (i*self.nbRangeRatio) + addLeftPos;
                $(".nb-left-handle").css({"left" : (leftHandlePos - 12) + "px"});
                $(".nb-range-handle").css({"width" : (rightHandlePos - leftHandlePos) + "px", "left" : leftHandlePos + "px"});
                $(".nb-range-input-min > input").val(inputValue);
                $(".nb-range-input-min > span").html(rupeeFormat(inputValue));
                self.rangeMinVal = inputValue;
            }

            function rupeeFormat(value) {
                var returnValue = '';

                try{
                    returnValue += parseInt(value,10);

                    returnValue = returnValue.toString();
                    var lastThree = returnValue.substring(returnValue.length-3);
                    var otherNumbers = returnValue.substring(0,returnValue.length-3);

                    if(otherNumbers !== '') {
                        lastThree = ',' + lastThree;
                    }
                    returnValue = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
                }catch(e){
                    returnValue = value;
                }

                // returnValue = "Rs. " + returnValue;
                return returnValue;
            }
		},


        resetRange : function(){
            var self = this;
            this.rangeMinVal = this.params.min;
            this.rangeMaxVal = this.params.max;
            this.params.handler({"minVal" : self.rangeMinVal, "maxVal" : self.rangeMaxVal});
            $(".nb-left-handle").css({"left" : "0px"});
            $(".nb-range-handle").css({"width" : "100%", "left" : "0px"});
            $(".nb-range-input-min > input").val(self.params.min);
            $(".nb-range-input-min > span").html(rupeeFormat(self.params.min));
            $(".nb-right-handle").css({"left" : "calc(100% - 12px)"});
            $(".nb-range-input-max > input").val(self.params.max);
            $(".nb-range-input-max > span").html(rupeeFormat(self.params.max));
        },

        setMinRange : function(val){
            var self = this;
            this.rangeMinVal = val;
            var stepCount = 0;
            var stepTotal = 0;
            var lastStepEnd = 0;
            var stepsArray = [];
            stepsArray.push(0);
            for(var i=0;i<self.params.steps.length;i++){
                stepCount = stepCount + ((self.params.steps[i].end - lastStepEnd)/self.params.steps[i].diff);
                for(var j=0;j<((self.params.steps[i].end - lastStepEnd)/self.params.steps[i].diff);j++){
                    stepTotal = stepTotal + self.params.steps[i].diff;
                    stepsArray.push(stepTotal);
                }
                lastStepEnd = self.params.steps[i].end;
            }
            var i;
            var inputValue = val;
            for(i=0;i< stepsArray.length;i++){
                if(inputValue == stepsArray[i] || (inputValue > stepsArray[i] &&  inputValue < stepsArray[i+1])){
                    break;
                }
            }
            var addLeftPos = 0;
            if(inputValue - stepsArray[i] > 0){
                addLeftPos = self.nbRangeRatio*((inputValue - stepsArray[i])/(stepsArray[i+1] - stepsArray[i]))
            }
            var leftHandlePos = (i*self.nbRangeRatio) + addLeftPos;
            var j;
            var inputValue = $(".nb-range-input-max > input").val();
            for(j=0;j< stepsArray.length;j++){
                if(inputValue == stepsArray[j] || (inputValue > stepsArray[j] &&  inputValue < stepsArray[j+1])){
                    break;
                }
            }
            var addRightPos = 0;
            if(inputValue - stepsArray[j] > 0){
                addRightPos = self.nbRangeRatio*((inputValue - stepsArray[j])/(stepsArray[j+1] - stepsArray[j]))
            }
            var rightHandlePos = (j*self.nbRangeRatio) + addRightPos;
            $(".nb-left-handle").css({"left" : (leftHandlePos - 12) + "px"});
            $(".nb-range-handle").css({"width" : (rightHandlePos - leftHandlePos) + "px", "left" : leftHandlePos + "px"});
            $(".nb-range-input-min > input").val(val);
            $(".nb-range-input-min > span").html(rupeeFormat(val));
        },

        setMaxRange : function(val){
            var self = this;
            this.rangeMaxVal = val;
            var stepCount = 0;
            var stepTotal = 0;
            var lastStepEnd = 0;
            var stepsArray = [];
            stepsArray.push(0);
            for(var i=0;i<self.params.steps.length;i++){
                stepCount = stepCount + ((self.params.steps[i].end - lastStepEnd)/self.params.steps[i].diff);
                for(var j=0;j<((self.params.steps[i].end - lastStepEnd)/self.params.steps[i].diff);j++){
                    stepTotal = stepTotal + self.params.steps[i].diff;
                    stepsArray.push(stepTotal);
                }
                lastStepEnd = self.params.steps[i].end;
            }
            var i;
            var inputValue = $(".nb-range-input-min > input").val();
            for(i=0;i< stepsArray.length;i++){
                if(inputValue == stepsArray[i] || (inputValue > stepsArray[i] &&  inputValue < stepsArray[i+1])){
                    break;
                }
            }
            var addLeftPos = 0;
            if(inputValue - stepsArray[i] > 0){
                addLeftPos = self.nbRangeRatio*((inputValue - stepsArray[i])/(stepsArray[i+1] - stepsArray[i]))
            }
            var leftHandlePos = (i*self.nbRangeRatio) + addLeftPos;
            var j;
            var inputValue = val;
            for(j=0;j< stepsArray.length;j++){
                if(inputValue == stepsArray[j] || (inputValue > stepsArray[j] &&  inputValue < stepsArray[j+1])){
                    break;
                }
            }
            var addRightPos = 0;
            if(inputValue - stepsArray[j] > 0){
                addRightPos = self.nbRangeRatio*((inputValue - stepsArray[j])/(stepsArray[j+1] - stepsArray[j]))
            }
            var rightHandlePos = (j*self.nbRangeRatio) + addRightPos;
            $(".nb-range-handle").css({"width" : (rightHandlePos - leftHandlePos) + "px", "left" : leftHandlePos + "px"});
            $(".nb-right-handle").css({"left" : (rightHandlePos - 12) + "px"});
            $(".nb-range-input-max > input").val(val);
            $(".nb-range-input-max > span").html(rupeeFormat(val));
        }
    }


    return nbRangeSlider;

}));
