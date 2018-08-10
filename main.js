$(document).ready(function(){
    var type = {
        food: 'food', 
        restroom: 'restroom', 
        essential: 'essential'
    };
    var floors = {
        0: {
            img: "https://lsc.colostate.edu/wp-content/uploads/2018/05/All-flat-maps_V2_separate-1.png",
            width: 726,
            height: 1806,
            locations: {
                0: new location("CSU Bookstore", "The CSU Bookstore provides books for your classes and CSU apparel.", type.essential, 460, 492),
                1: new location("Restroom", "Located across from Cam's Lobby shop, near the Transportation Center.", type.restroom, 464, 253),
                2: new location("Cam's Lobby Shop","Cam's Lobby Shop offers a variety of snacks, meals, beverages, and personal care items.",type.food,672,155),
                3: new location("Ramskeller", "Ramskeller offers a variety of pub food, non-alchoholic drinks, as well as local brews.", type.food, 189, 965),
                4: new location("Restroom", "Located past Ramskeller, just before a staircase leading outside.", type.restroom, 28, 1145),
                //5: new location("Restroom", "Located in the long hallway between the front, north facing, doors and a large gathering area. ", type.restroom, 410, 801)
            }
        },
        1: {
            img: 'https://lsc.colostate.edu/wp-content/uploads/2018/05/All-flat-maps_V2_separate-2.png',
            width: 871,
            height: 1806,
            locations: {
                0: new location("Restroom", "Located in the hallway between the CSU Bookstore and RAMtech.", type.restroom, 519, 210),
                1: new location("RAMtech", "RAMtech provides software and hardware, including the newest laptops.", type.essential, 622, 278),
                2: new location("CSU Bookstore", "The CSU Bookstore provides books for your classes and CSU apparel.", type.essential, 537, 452),
                3: new location("First National Bank", "The official bank of CSU, you can open an account and get a Visa debit card here.", type.essential, 630, 737),
                4: new location("RamCard Office", "Your first stop - the RamCard Office prints your first RamCard for free.", type.essential, 681, 605),
                5: new location("Restroom", "Located across from the Campus Information Desk.", type.restroom, 647, 1225),
                6: new location("Campus Info Desk", "The employees at the Campus Information Desk can assist you with directions.", type.essential, 645, 1125),
                7: new location("Restroom", "Located by the west facing doors of the LSC, just past the Food Court.", type.restroom, 118, 1103),
                8: new location("Restroom", "Located by the LSC Theatre, just past Intermissions.", type.restroom, 175, 1561),
                9: new location("Restroom", "Located across from Intermissions.", type.restroom, 523, 1636) ,
                10: new location("Subway", "Order fresh sub sandwiches, salads, and wraps made especially for you.", type.food, 213, 975),
                11: new location("Carl's Jr.", "Fast food featuring hamburgers, french fries, chicken tenders, and breakfast sandwiches.", type.food, 509, 905),
                12: new location("Spoons", "Fresh salads, soups, and bread prepared daily, right in front of you.", type.food, 374, 869),
                13: new location("Bagel Place", "Bagel Place serves an assortment of bagels, bagel sandwiches, and coffee.", type.food, 291, 869),
                14: new location("Garbanzo Express", "Garbanzo offers fresh, healthy Mediterranean food including falafel and gyro sandwiches.", type.food, 215, 869),
                15: new location("Panda Express", "Serving gourmet Chinese food, including rice bowls and dinner plates, since 1983.", type.food, 136, 873),
                16: new location("Sweet Sinsations", "Sweet Sinsations serves delicious bakery items, gourmet coffees, and espressos.", type.food, 797, 1131)
            }
        },
        2: {
            img: 'https://lsc.colostate.edu/wp-content/uploads/2018/05/All-flat-maps_V2_separate-3.png',
            width: 884,
            height: 1670,
            locations: {
                //0: new location("Restroom", "Located", type.restroom, 526, 135),
                0: new location("Restroom", "Located in the hallway north of the Grand Ballrooms on the east side. ", type.restroom, 653, 655),
                1: new location("Restroom", "Located past the Grand Ballrooms, on your left as you exit the Main Staircase.", type.restroom, 639, 1112)
            }
        }
    }

    function location(name, desc, type, x, y){
        this.name = name;
        this.desc = desc;
        this.type = type;
        this.x = x;
        this.y = y;
    }

    /* START NEW */
    function eToXY(e){
        if(e.touches) return { x: e.touches[0].pageX, y: e.touches[0].pageY };
        else if(e.pageX) return { x: e.pageX, y: e.pageY };   
        else if(e.x) return { x: e.x, y: e.y };   
    }
    function isInMapArea(e){
        if(e.x > 0 && e.pageX < $(window).width()) return true;
        if(e.y > $("#floors").height() && e.y < $(window).height() - $("#filters").height()) return true;
        return false;
    }
    function isOnMap(e){

    }
    var dragging = false;
    var pE_xy = null;
    $(document).on("mousedown touchstart", function(e){
        if($(e.target).hasClass("map-pin")) return;
        pE_xy = eToXY(e);    
        if(isInMapArea(pE_xy)){
            dragging = true;
        } else {
            pE_xy = null;
        }
    });
    $(document).on("mousemove touchmove", function(e){
        if(dragging){
            var nE_xy = eToXY(e);
            diff = {x: nE_xy.x - pE_xy.x, y: nE_xy.y - pE_xy.y };
            $("#currentmap").css({
                "margin-top": "+=" + diff.y * zoomScalar,
                "margin-left": "+=" + diff.x * zoomScalar                
            });
            pE_xy = nE_xy;
            putLocations();
        }
    });
    $(document).on("mouseup mouseleave touchend touchcancel", function(e){
        dragging = false;
        pE_xy = null;    
    });

    
    $("#currentmap").on("doubletap dblclick", function(e){
        preventE(e)
        if($(e.target).hasClass("map-pin")) return;
        var exy = eToXY(e);    
        if(isInMapArea(exy) && !zooming){
            zoom(exy);
        }
    });
    var zoomScalar = 1;
    var zoomAmount = 1;
    var zooming = false;
    function zoom(){
        zooming = true;
        //Determine how much we are zooming in
        if(zoomAmount == 2) zoomAmount--;
        else if(zoomAmount == 1) zoomAmount++;
        zoomScalar = 1/zoomAmount;
        
        //where, relative to the map did we tap?
        //var diff = { x:  };
        $("#mapcontainer").animate({"zoom": zoomAmount}, { step: putLocations, duration: 250, complete: function(){
            zooming = false;
        }});
    }
    /* END NEW */
        
    var currentFloor = 1;
    $("#PreviousFloor").on("click tap ", function(){
        if(currentFloor > 0) {
            $(".closeinfo").click();  
            --currentFloor;       
            $("#mapcontainer").animate({'opacity': 0},250,function(){
                $("div#pins").empty();                
                $("#currentmap").attr("src", floors[currentFloor].img);
            });
        }
    });
    $("#NextFloor").on("click tap ", function(){
        if(currentFloor < 2) {
            $(".closeinfo").click();
            ++currentFloor;      
            $("#mapcontainer").animate({'opacity': 0},250,function(){
                $("div#pins").empty();
                $("#currentmap").attr("src", floors[currentFloor].img);
            });
        }
    });
    
    function putLocations(){
        var sizeScalar = ($("img#currentmap").width() / floors[currentFloor].width);

        //Just moves the pins
        if($("div#pins").children().length > 0){
            if(floors[currentFloor].locations){
                var map = document.querySelectorAll('#currentmap')[0];
                var offset = getPosition(map);
                for(var i = 0;i < $("div#pins").children().length;i++){
                    var $pin = $($("div#pins").children()[i]);
                    var locO = floors[currentFloor].locations[parseInt($pin.data("key"))];
                    $($pin).css({
                        "top": locO.y * sizeScalar,
                        "left": parseFloat($("img#currentmap").css("margin-left")) + (locO.x * sizeScalar)
                    });
                }
            }
        } else { //Creates the pins and moves them
            if(floors[currentFloor].locations){
                var map = document.querySelectorAll('#currentmap')[0];
                var offset = getPosition(map);
                for(var key in floors[currentFloor].locations){
                    $loc = $("<i class='map-pin map-pin-selected fas fa-map-marker-alt'></i>")
                    //$loc = $("<i class='map-pin map-pin-selected fas fa-map-pin'></i>")  
                    var locO = floors[currentFloor].locations[key];
                    $loc.css({
                        "top": locO.y * sizeScalar,
                        "left": parseFloat($("img#currentmap").css("margin-left")) + (locO.x * sizeScalar),                            
                    })
                    $loc.attr("data-key", key);
                    $loc.attr("data-type", locO.type);

                    $("div#pins").append($loc);
                    $loc.css("margin-top", "-=" + parseFloat($loc.height()));
                    $loc.css("margin-left", "-=" + parseFloat($loc.width()) / 2);
                }
            }
            setMapPinState();
        }
    }

    function preventE(e){
        e.stopPropagation();
        e.preventDefault();
    }

    $selectedPin = null;
    var last_pin_tap = null;
    $(document).on("click touchstart", ".map-pin", function(e){
        if(zoomAmount == 2) zoom();
        preventE(e);
        $selectedPin = $(this);
        last_pin_tap = Date.now();

        $(this).attr("id", "selected-pin");
        var key = $selectedPin.data("key");
        
        var pos = getPosition(this);
        pos.x += $selectedPin.width() / 2;
        pos.y -= $selectedPin.height() * 2;
        var center = {x: $(window).innerWidth() / 2, 
                        y: ($(window).innerHeight() - (($("#infobox").height() * (2/3)) + $("#filters").height() + $("#floors").height())) / 2};
        var diff = {x: (center.x - pos.x), y: (center.y - pos.y)};
        
        var imgPos = {x: parseFloat($("#mapcontainer img").css("margin-left")),
                      y: parseFloat($("#mapcontainer img").css("margin-top"))};

        $("#mapcontainer img").animate({
            "margin-top": imgPos.y + diff.y,
            "margin-left": imgPos.x + diff.x,
        }, {duration: 350, step: putLocations}); 

        $("#infobox h1").text(floors[currentFloor].locations[key].name);
        $("#infobox p").text(floors[currentFloor].locations[key].desc);

        $("#infobox").animate({
            "top": "65%"
        }, 250);
    });

    $(".closeinfo, #currentmap").on("click tap", function(e){
        if($selectedPin !== null && Date.now() - last_pin_tap > 250){
            last_pin_tap = null;
            $selectedPin.css("color", "");
            $("i.map-pin").css("color", "red");
            $selectedPin = null;
            $("#infobox").animate({
                "top": "100%"
            }, 250);
        }
    });

    function selectPin(pin){
        var key = $(pin).data("key");
        $("i.map-pin").each(function(){
            $t = $(this);
            if($t.data("key") == key){
                if($t.hasClass("map-pin-deselected")) $t.removeClass("map-pin-deselected");
                if(!$t.hasClass("map-pin-selected")) $t.addClass("map-pin-selected");   
            } else {
                if(!$t.hasClass("map-pin-deselected")) $t.addClass("map-pin-deselected"); 
                if($t.hasClass("map-pin-selected")) $t.removeClass("map-pin-selected");
            }

        });
    }

    /**
     * Stolen from https://stackoverflow.com/questions/11805955/how-to-get-the-distance-from-the-top-for-an-element
     */
    function getPosition(element) {
        var xPosition = 0;
        var yPosition = 0;
    
        while(element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
    
        return { x: xPosition, y: yPosition };
    }

    function onResize_onMapLoad(){
        //Change the current floor text
        $("#CurrentFloor p").text("Level " + (currentFloor + 1) + "00"); 

        if(currentFloor == 0){
            $("#PreviousFloor").css("opacity", "0");
            $("#NextFloor").css("opacity", "1");
            $("#NextFloor div p + p").text((currentFloor + 2) + "00");
        } else if(currentFloor == 1){
            $("#PreviousFloor").css("opacity", "1");
            $("#NextFloor").css("opacity", "1");                  
            $("#PreviousFloor div p + p").text((currentFloor) + "00");
            $("#NextFloor div p + p").text((currentFloor + 2) + "00");
        } else if(currentFloor == 2){
            $("#PreviousFloor").css("opacity", "1");                    
            $("#PreviousFloor div p + p").text((currentFloor) + "00");
            $("#NextFloor").css("opacity", "0");
        }

        //Ensure the map fits the window
        var mapH = $(window).innerHeight() - ($("#floors").outerHeight() + $("#filters").outerHeight());
    
        $("#mapcontainer").css("height", mapH);                
        $("#mapcontainer").css("margin-top", $("#floors").outerHeight());

        var wh = $("#mapcontainer").innerHeight();
        var ww = $("#mapcontainer").innerWidth();

        $("#currentmap").height(wh);
        $("#currentmap").css("width", "");
        $("#currentmap").css({
            "margin-top": "",
            "margin-left": ""
        });                    
        
        var mw = $("#currentmap").width();
        if(mw > ww) {
            $("#currentmap").width(ww);
            $("#currentmap").css("height", "");

            var mh = $("#currentmap").height();                
            $("#mapcontainer").css("margin-top", parseFloat($("#mapcontainer").css("margin-top")) + ((wh/2) - (mh/2)));                       
        }
        /*$("#filters p").each(function(){
            $(this).attr("data-selected", "false");
            $(this).removeClass("filter-selected");
        });*/
        
        $("i.map-pin").each(function(){
            if(!$(this).hasClass("map-pin-selected"))
                $(this).addClass("map-pin-selected");

            if($(this).hasClass("map-pin-deselected"))
                $(this).removeClass("map-pin-deselected");
        });

        putLocations();
                        
        $("#mapcontainer").animate({'opacity': 1},250);
    }
    onResize_onMapLoad();
    $(window).resize(onResize_onMapLoad);  
    $(window).on("resizeend", onResize_onMapLoad); 
    $("img#currentmap").on("load", function(){
        onResize_onMapLoad();
    });     
    
    $("#compass *").on("click tap", function(){
        onResize_onMapLoad();
    });

    var showType;
    $("#filters p").on("click tap", function(){
        var id = $(this).attr("id");
        if($(this).attr("data-selected") == "true"){
            showType = null;
            $("#filters p").each(function(){
                $(this).attr("data-selected", false);
                $(this).removeClass("filter-deselected");              
            });
        } else {
            $(this).attr("data-selected", "true");
            $("#filters p").each(function(){
                if($(this).attr("id") != id){
                    $(this).addClass("filter-deselected");
                    $(this).attr("data-selected", false)
                } else {
                    $(this).removeClass("filter-deselected");
                }
            });
            switch(id){
                case "Food":
                    showType = "food";
                break;
                case "Restrooms":
                    showType = "restroom";
                break;
                case "Essentials":
                    showType = "essential";
                break;
            }
        }
        setMapPinState();
    });

    function setMapPinState(){
        $("i.map-pin").each(function(){
            resetPin(this);
            if(showType == null || $(this).data("type") == showType){
                //All red
                if(showType == null)                      $(this).addClass("map-pin-selected");
                //Only other type
                else if($(this).data("type") == showType) $(this).addClass("map-pin-selected-" + showType);
            } else {
                if(!$(this).hasClass("map-pin-deselected"))
                    $(this).addClass("map-pin-deselected");
            }
        });
    }

    function resetPin(pin){
        $t = $(pin);
        $t.removeClass("map-pin-selected");
        $t.removeClass("map-pin-deselected");
        $t.removeClass("map-pin-selected-food");
        $t.removeClass("map-pin-selected-essential");
        $t.removeClass("map-pin-selected-restroom");
    }
});