// The search database option text.
CONST CHOICE_SEARCH_DATABASE = "Search database"

// Location options.
CONST HOME = "home"
CONST POLICE_STATION = "police_station"
CONST GREEN_BAKERY = "green_bakery"

// Time of day options.
CONST MORNING = "morning"
CONST AFTERNOON = "afternoon"
CONST EVENING = "evening"

// Variables.
VAR location = ""
VAR time_of_day = ""

// Database options.
VAR database_jasmijn_hofwegen = false
VAR database_kasper_hofwegen = false
VAR database_hofwegen_disappearance = false
VAR database_simone_bell = false
VAR database_lars_green = false
VAR database_green_bakery = false
VAR database_miki_mori = false
VAR database_ron_dekker = false

* [START STORY]
-	-> morning_routine -> the_start

=== set_time_of_day(_time_of_day) ===
~ time_of_day = _time_of_day
-	->->

=== the_start ===
-	-> set_time_of_day(MORNING) -> morning_routine -> make_choice -> set_time_of_day(AFTERNOON) -> make_choice -> set_time_of_day(EVENING) -> make_choice -> the_start

=== the_end ===
- THE BE CONTINUED (Sorry...)
-	-> END

=== make_choice ===
+	[Investigation tip.]
	-- {& Try writing down what you have uncovered so far. | Have you made any assumptions that could be wrong? }
	-- -> make_choice
+	[{CHOICE_SEARCH_DATABASE}]
	--	-> make_choice
+	[Visit a location]
	--	-> pick_location

=== pick_location ===
-	Now the real question was where should I be going.
+	[Return to previous options]
	--	-> make_choice
+	{location != POLICE_STATION}[Police station]
    --  -> police_station
+	{location != GREEN_BAKERY && database_green_bakery}[Green Bakery]
	--	-> green_bakery

=== morning_routine ===
~ location = HOME
-	-> wake_up

= wake_up
-	I woke up the first light of dawn making its way through the curtains. My schedule was empty, I had no plans made for today, which usually means a nice quiet day just what I hoped for.
+	[Sleep in] I rolled around again and decided to rest my eyes some more. Only to be woken up by some noise from downstairs. I quickly got dressed and stumbled down the stairs.
*	[Get up] However I would hate to see the day go to waist, and decided I might as well get out of bed now. I got myself cleaned, dressed, and made my way downstairs in order to prepare some breakfast.
+	{morning_routine > 2} [Get up] Yet again the day repeated itself. I prepared myself and quickly made my way downstairs.
+	{morning_routine == 2} "Wait what... home..."[] I said to myself still have asleep. Yesterday behind bars, but now in my own bed. I decided to check what day it is. The 3rd of March, but I was quite meticulous in marking of each passing day. I thought to myself yesterday, or rather today must have been a dream.
-	-> door_knock

= door_knock
-	Suddenly a loud knocking came from the door. "Open up, police!" a man shouted. "We know your in there." another voice continued.
+	[Open the door] "Yea, yea, almost there" I yelled out as I made my way to the door. When I opened up I saw the two police officers standing on my porch. "You are under arrest for the murder of Miss Green, and will need to come with us."
	**	{morning_routine == 1}[Ask what is going on] Perplexed I asked, "What do you mean? Me, being accused of murder." "Technically being charged for murder, and therefore have to come with us." The second officer said, "Just put your hands behind you back and turn around." Refusing to give myself over that easily I asked, "I'm sorry, but no, you have no reason to take someone who is innocent from their own home." The first officer getting impassioned turned me around and handcuffed me. With my arms behind my back they walked we to their car.
		--- -> police_car
	**	{morning_routine == 1}[Flee out back] Without hesitation my head went into flight mode as I sprinted for the door out back. However before I managed to get there I stumbled and fell over. After which one of the officers quickly push me down with my head mitting the dresser.
		---	"Finally awake I see. Next time don't try to run, okay," an officer remarked as I shot awake, "Only makes the whole ordeal unnecessarily longer." Now I was in the back seat of a car, handcuffed and all. "We are nearly there." the other officer said from behind the wheel as I saw the police office appear on the side of the road.
		---	-> police_station_arrested
	**	{morning_routine == 1}[Go with them] The best thing I could was co-operate, after all they have the wrong person. My name will be cleared in no time at all. We entered the car and we drove off to the police station.
		---	-> police_car
	**	{morning_routine.door_knock == 2} ->
		---	"Alright then" I said. Just like last time they handcuffed me and brought me into their car, and set way for the police station a few block away.
		---	-> police_car
	++	{morning_routine.door_knock > 2} ->
		---	"Alright then" I said after immediately turning around with my hands behind might back. The second officer spoke "This is going quicker and a lot easier than expected." We entered the car and started to make our way to the police station.
		--- -> police_car
+	{morning_routine > 1}[Flee out back] I quickly made my way to the door out back grabbing any belongs I might need with me. I decided to leave my phone, but my laptop might prove to useful, I can access a database of information from it.
	--	->->

= police_car
- The handcuffs around my wrists we starting to feel tight at this point. No idea on what to next I decided it would be best if I.
+	[Deny any involvement] "I don't even know anyone with the name Green," I told them, "You have to believe me I did nothing". "Unfortunately for you we are no judges," One of the officers told me, "Pleading with us won't do you any good."
+	[Ask about the case] "What could you tell me about what I have supposedly done," I asked them. "Well, according to what we have been told by her brother Lars..." the first said before being interrupted by the other, "If anybody knows what happened it's you, and guess what you will be the one to tell us." Before I had a change to respond I noticed the police station appear in the distance. ""
+	[Stay silent] We passed the rest of the ride in silence.
-	-> police_station_arrested

=== police_station_arrested ===
-	They walked me through the doors of the station like some sort of trophy. After having to walk through corridor after corridor they put me in a small room. It had a table in the middle with two chairs on either end and a large and ominous mirror. One of the officers undid my handcuffs and said "Someone will be right here soon for you." After which they both left and locked the door behind them. I started staring at the mirror certain someone was looking through that thing right at me. After a while I decided to take a seat and just wait it out for what felt like hours.
-	Eventually I heard the door swing open. "Hello, I'm detective Simone Bell. I suppose you know why we brought you in here" she said as she walked in the room and sat down. Quickly after her a man followed suit, "And this is my colleague Williams." he sat down on the chair besides hers.
+	[Deny any involvement] "I have nothing to do with what you are accusing me off!" I declared. "Slow down there, what do you have nothing to do with?" Bell said leaning in. "I don't know, you guys showed up on my doorstep and arrested me for no reason." "I'm sure the officers who brought you here told you about you killed an innocent woman" Williams interrupted.
	++	[Miss Green] "Yea, but all they said was that someone with the last name Green was killed, and I am suspected of doing that to her. I don't even know her!" I told, at this point feeling rather desperate about the whole situation. "We know you know her. We have video surveillance footage of the two of you talking in the bakery of her brother." Bell said, now leaning back in her chair.
	--	-> after_interrogation
+	[Ask what is going on] "What's going here? You come to my house and arrest me, for what?" I asked them. Williams looking strait at me "Don't play dumb, you know why we brought you in here." "Perhaps we will need to refresh his memory a little bit." said Bell, "Two days ago you murdered an innocent woman and tried to get away with it. We got a report in from her brother that she never came home that day." "And don't try the 'I had no idea she even existed' line," Williams abruptly interrupted, "We have video surveillance footage of the two of you talking in the bakery of her brother."
-	-> after_interrogation

= after_interrogation
-	"You know what I think we are done here for now, I'm sure the warrant we have for your house will turn something up sooner rather than later." Bell said as she stood up and walked towards the door. Williams followed right after, but not before he threw a stern look my way.
-	After they left it was just me on my own again in this empty room for a good long while again.
-	-> the_start

=== police_station ===
~ location = POLICE_STATION
-	As I approached the doors of the police station it finally got to me. Am I really just going to walk in, a fugitive. Before I even got close two officers approached me and arrested me.
-	-> police_station_arrested

=== green_bakery ===
-	As I arrived on Elmwood Street at the bakery it looked close, the sign saying "We are closed" gave most of it away. However I did hear something going on in the back of the store.
+	[Walk around to the back] The curiosity got the better of me, I decided to walk to the back via an alleyway next to the bakery. Perhaps I could enter via another way.
	--	As I reached the end of the path I noticed an unlocked side door. If I wanted to learn about Lars Green and his sister this was my only option. Without further hesitation I snuck in and quietly closed the door behind me. 
	--	The room I entered was clearly used for storage with bags of flour and some personal defects lying inside an open locker. At that point I definitely wasn't above rifling through some else's belongings anymore. Nothing of much interest came by until I found a purse. Inside it was what you would expect some make-up, a wallet belonging to a 'Joan Green', and a picture of a blonde teenager standing next to a horse. On the back was written 'Jasmijn Hofwegen 2006 Pony park'.
	--	-> searching_backroom

= searching_backroom
+	[{CHOICE_SEARCH_DATABASE}] 
	--	-> searching_backroom
+	[Look for Lars]
	--	I decided might as well look for him and pose a few question. I walked out of the storage room and into a room covered in flour with several bread ovens filled with bread baking. As soon as I started to snoop around the room I heard a loud voice next to me "What do you think you are doing in here!"
	--	"You must be Lars," I said trying to appear confident, I found what I was looking for after all. "Yes, and you are?" he responded. But before I got an answer in he yelled out "I know you! what are you doing here. I told the police to arrest you a long time ago!" I already expected him to be the cause of that.
	++	{database_jasmijn_hofwegen}[Ask about Jasmijn] "Then you might also help me explain who Jasmijn Hofwegen is." I asked. "No clue," he responded nervously as if I caught him off guard "never heard that name before."
	--- "Then what was a picture of her doing in Joan's bag..."
	--	-> the_end