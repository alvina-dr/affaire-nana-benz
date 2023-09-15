/////////////////////////////////////////////////////////////
/// Escapausorus v1 (2020)
///	A quick and dirty framework to create small adventure game (certified vanilla JS)
/// Author: Stéphanie Mader (http://smader.interaction-project.net)
/// GitHub: https://github.com/RedNaK/escaposaurus
///	Licence: MIT
////////////////////////////////////////////////////////////

	/*
		HERE IS THE CONFIGURATION OF THE GAME
	*/
		/*either online with VOD server and JSON load of data
		either local */
		var isLocal = true ;
 		var gameRoot = "./" ;
 		var gameDataRoot = gameRoot+"escaposaurus_examplegamedata/" ;
 		var videoRoot = gameDataRoot+"videos/" ;

 		/*caller app*/
		var contactVideoRoot = videoRoot+"contactVideo/" ;

		/*full path to intro / outro video*/
		var missionVideoPath = videoRoot+"introVideo/intro1.mp4" ;
		var introVideoPath = videoRoot+"introVideo/intro2.mp4" ;
		var missingVideoPath = videoRoot+"contactVideo/missing/final.mp4" ;
		var epilogueVideoPath = videoRoot+"epilogueVideo/epiloguecredit.mp4" ;

		/*udisk JSON path*/
		var udiskRoot = gameDataRoot+"udisk/" ;

		/*for online use only*/
		/*var udiskJSONPath = gameRoot+"escaposaurus_gamedata/udisk.json" ;
		var udiskJSONPath = "/helper_scripts/accessJSON_udisk.php" ;*/

		var udiskData =
	  	{"root":{
	  		"folders":
		  		[{"foldername":"Affaire_Nana_Benz", "password":"peau de léopard","sequence":0,
				  	"files":["Historique_des_ventes.jpg", "Memo_contacts.png"],
					"folders":[
						{"foldername":"Références_motifs",
						"folders": [
							{"foldername":"Best_sellers", "files":["Best_seller_1.jpg", "Best_seller_2.jpg", "Best_seller_3.jpg", "Best_seller_4.jpg", "Best_seller_5.jpg"]}], 
							"files":["Liste_motifs.jpg", "Liste_noms.jpg"], 
						},
						{"foldername": "Historique_judiciaire", "files":["CR_affaire_1992.jpg", "CR_affaire_1996.jpg","CR_affaire_1998.jpg"], "hidden": "true"},
						{"foldername": "Archive", "files":["Archive_africa24.mp4", "Article_DRG_Creppy.jpg","Coupure_presse.jpg"], "hidden": "true"},
						{"foldername":"preuves",
						"folders": [
							{"foldername": "preuve1", "password":"Je cours plus vite que ma rivale","sequence":1, 
						"files":["Je_cours_plus_vite_que_ma_rivale.jpg"]},
							{"foldername": "preuve2", "password":"Sublime mensonge","sequence":2,
							"files":["Sublime_mensonge.jpg"]},
							{"foldername": "preuve3", "password":"Va et vient","sequence":3,
							"files":["Va_et_vient.jpg"]}
						]}
					]
				}],
			"files":[
				"Lettre_Mme_Creppy.jpg"]}
		} ;

		var gameTitle = "Escaposaurus Scenario Exemple" ;
		var gameDescriptionHome = "Ceci est une courte aventure d'exemple pour montrer ce que le framework Escaposaurus permet facilement de réaliser.<br/>Le code source est téléchargeable sur <a href='https://github.com/RedNaK/escaposaurus' target='_blank'>GitHub</a>" ;
		var gameMissionCall = "" ;
		var gameMissionAccept = "Commencer" ;

		var gameCredit = "<b>Jeu réalisé par :</b><br/>Alvina Damasio--Razafiarizaka<br>Gabriel Ducray<br>Mathéo Patxi Gonzalez<br>Mahé Letellier<br>Vasco Mendes Ferreira<br>Enzo Tittarelli" ;
		var gameThanks = "<b>Remerciements :</b><br/>À tous nos playtesters <br/>Au corps enseignant de l'ENJMIN" ;

		var OSName = "Nom" ;
		var explorerName = "Réseau:/Drive" ;
		var callerAppName = "Messagerie - Contact" ;

		/*titles of video windows*/
		var titleData = {} ;
		titleData.introTitle = "Introduction" ;
		titleData.epilogueTitle = "Épilogue" ;
		titleData.callTitle = "Appel en cours..." ;

		/*change of caller app prompt for each sequence*/
		var promptDefault = "Rien à demander, ne pas les déranger." ;
		var prompt = [] ;
		prompt[0] = "Prendre contact" ;
		prompt[1] = "" ;
		prompt[2] = "" ;
		prompt[3] = "Envoyer la carte" ;
		prompt[4] = "Appeler Nathalie pour savoir où en sont les secours." ;

		/*when the sequence number reach this, the player win, the missing contact is added and the player can call them*/
		var sequenceWin = 4 ;

		/*before being able to call the contacts, the player has to open the main clue of the sequence as indicated in this array*/
		/*if you put in the string "noHint", player will be able to immediatly call the contact at the beginning of the sequence*/
		/*if you put "none" or anything that is not an existing filename, the player will NOT be able to call the contacts during this sequence*/
		var seqMainHint = [] ;
		seqMainHint[0] = "noHint" ;
		seqMainHint[1] = "Best_seller_5.jpg" ; /*if you put anything that is not an existing filename of the udisk, the player will never be able to call any contacts or get helps during this sequence*/
		seqMainHint[2] = "noHint" ;
		seqMainHint[3] = "noHint" ;

		/*contact list, vid is the name of their folder in the videoContact folder, then the game autoload the video named seq%number of the current sequence%, e.g. seq0.MP4 for the first sequence (numbered 0 because computer science habits)
	their img need to be placed in their video folder, username is their displayed name
		*/
		var normalContacts = [] ;
		normalContacts[0] = {"vid" : "Avocat", "vod_folder" : "", "username" : "Maître De Villiers", "canal" : "video", "avatar" : "avocat_avatar.jpg", "subjectChoice": false} ;
		normalContacts[1] = {"vid" : "JP", "vod_folder" : "", "username" : "JP (sms pour indice!!!)", "canal" : "txt", "avatar" : "jp_avatar.jpg", "bigAvatar" : "jP_big.png", "subjectChoice": false} ;

		/*second part of the list, contact that can help the player*/
		var helperContacts = [] ;
		/*helperContacts[1] = {"vid" : "Lou", "username" : "Lou (pour avoir un deuxième indice) - par message", "canal" : "txt", "avatar" : "Lou_opt.jpg", "bigAvatar" : "avatarHelper2Big.gif"} ;*/


		/*ce qui apparait quand on trouve le dernier élément du disque dur*/
		finalStepAdded = "Toutes les preuves sont rassemblés pour gagner le procès." ;

		/*the last call, it can be the person we find in the end or anyone else we call to end the quest, allows the game to know it is the final contact that is called and to proceed with the ending*/
		var missingContact = {"vid" : "Prof", "vod_folder" : "Prof", "username" : "Prof. Francis", "canal" : "video", "avatar" : "prof_avatar.jpg", "subjectChoice": true} ;

		/*Lou only send text message, they are stored here*/
		var tips = {} ;
		tips['JP'] = [] ;
		tips['JP'][0] = "Le mot de passe du drive ? De Villiers t'as pas dit que c'était le premier motif de l'entreprise ? Il est mentionné dans la lettre de la fille, y en a pas milles de toutes façons... Essaie de réfléchir deux secondes avant de me faire perdre mon temps." ;
		tips['JP'][1] = "Dans les best-sellers ? Il y a un dossier best sellers sur le drive, il y a qu'un seul motif bleu dedans. Tu met son nom dans le dossier preuve 1 pour le consigner. Franchement ça fait combien de temps que tu bosse ici ? Tu sais rien faire par toi même ?" ;
		tips['JP'][2] = "Une vieille affaire ? Il me semble qu'on a représenté qu'une seule affaire pour le compte de Creppy en 96, tu devrais pouvoir retrouver le compte rendu dans le dossier 'historique judiciaire', le motif mentionné dedans est notre deuxième preuve. Faut que tu apprennes à te démerder par contre parce qu'à ce rythme t'auras jamais tes propres affaires..." ;
		tips['JP'][3] = "Sur l'historique de ventes il y a une irrégularité massive sur le nombre de ventes d'un motif. C'est celui là que tu cherches. Je pensais que tu serais capable de voir au moins ça." ;


		/*text for the instruction / solution windows*/
		var instructionText = {} ;
		instructionText.winState = "Vous avez retrouvé l'id GPS et vous pouvez appeler les secours du secteur." ;
		instructionText.lackMainHint = "" ;
		instructionText.password = "Vous devez trouver et entrer le mot de passe d'un des dossiers de la boite de droite. Vous pouvez trouver le mot de passe en appelant les contacts de la boite de gauche.<br/>Pour entrer un mot de passe, cliquez sur le nom d'un dossier et une fenêtre s'affichera pour que vous puissiez donner le mot de passe." ;

		/*please note the %s into the text that allow to automatically replace them with the right content according to which sequence the player is in*/
		var solutionText = {} ;
		solutionText.winState = "Si Sabine a été secourue, le jeu est fini bravo." ;
		solutionText.lackMainHint = "Vous devez ouvrir le fichier <b>%s</b><br/>" ;
		solutionText.password = "Vous devez déverouiller le dossier <b>%s1</b><br/>avec le mot de passe : <b>%s2</b><br/>" ;

		var openTabSound = new Audio("../escaposaurus_examplegamedata/sound/opentab.wav");
		var closeTabSound = new Audio("../escaposaurus_examplegamedata/sound/closetab.wav");
		var startupXPSound = new Audio("../escaposaurus_examplegamedata/sound/startup_sound_xp.wav");