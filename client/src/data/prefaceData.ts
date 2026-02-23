export interface PrefaceData {
  dedicationLabel: string;
  dedication: string[];
  mottoLabel: string;
  motto: string;
  mottoAuthor: string;
  prefaceLabel: string;
  prefaceParagraphs: string[];
  signature: string;
  location: string;
  showButton: string;
  hideButton: string;
}

export const prefaceEN: PrefaceData = {
  dedicationLabel: 'Dedication',
  dedication: [
    'Dedicated',
    'to the memory of my friend',
    'DAVID H. PINSENT',
  ],
  mottoLabel: 'Motto',
  motto: '\u2026 und alles, was man weiss, nicht bloss rauschen und brausen geh\u00f6rt hat, l\u00e4sst sich in drei Worten sagen.',
  mottoAuthor: 'K\u00fcrnberger',
  prefaceLabel: 'Preface',
  prefaceParagraphs: [
    'This book will perhaps only be understood by those who have themselves already thought the thoughts which are expressed in it\u2014or similar thoughts. It is therefore not a text-book. Its object would be attained if there were one person who read it with understanding and to whom it afforded pleasure.',
    'The book deals with the problems of philosophy and shows, as I believe, that the method of formulating these problems rests on the misunderstanding of the logic of our language. Its whole meaning could be summed up somewhat as follows: What can be said at all can be said clearly; and whereof one cannot speak thereof one must be silent.',
    'The book will, therefore, draw a limit to thinking, or rather\u2014not to thinking, but to the expression of thoughts; for, in order to draw a limit to thinking we should have to be able to think both sides of this limit (we should therefore have to be able to think what cannot be thought).',
    'The limit can, therefore, only be drawn in language and what lies on the other side of the limit will be simply nonsense.',
    'How far my efforts agree with those of other philosophers I will not decide. Indeed what I have here written makes no claim to novelty in points of detail; and therefore I give no sources, because it is indifferent to me whether what I have thought has already been thought before me by another.',
    'I will only mention that to the great works of Frege and the writings of my friend Bertrand Russell I owe in large measure the stimulation of my thoughts.',
    'If this work has a value it consists in two things. First that in it thoughts are expressed, and this value will be the greater the better the thoughts are expressed. The more the nail has been hit on the head.\u2014Here I am conscious that I have fallen far short of the possible. Simply because my powers are insufficient to cope with the task.\u2014May others come and do it better.',
    'On the other hand the truth of the thoughts communicated here seems to me unassailable and definitive. I am, therefore, of the opinion that the problems have in essentials been finally solved. And if I am not mistaken in this, then the value of this work secondly consists in the fact that it shows how little has been done when these problems have been solved.',
  ],
  signature: 'L.W.',
  location: 'Vienna, 1918.',
  showButton: 'Show Preface',
  hideButton: 'Hide Preface',
};

export const prefaceFR: PrefaceData = {
  dedicationLabel: 'D\u00e9dicace',
  dedication: [
    'D\u00e9di\u00e9 \u00e0 la m\u00e9moire de mon ami',
    'DAVID H. PINSENT',
  ],
  mottoLabel: 'Devise',
  motto: '\u2026 et tout ce que l\u2019on sait, qu\u2019on n\u2019a pas seulement entendu comme un bruissement ou un grondement, se laisse dire en trois mots.',
  mottoAuthor: 'K\u00fcrnberger',
  prefaceLabel: 'Avant-propos',
  prefaceParagraphs: [
    'Ce livre ne sera peut-\u00eatre compris que par qui aura d\u00e9j\u00e0 pens\u00e9 lui-m\u00eame les pens\u00e9es qui s\u2019y trouvent exprim\u00e9es \u2013 ou du moins des pens\u00e9es semblables. Ce n\u2019est donc point un ouvrage d\u2019enseignement. Son but serait atteint s\u2019il se trouvait quelqu\u2019un qui, l\u2019ayant lu et compris, en retir\u00e2t du plaisir.',
    'Le livre traite des probl\u00e8mes philosophiques, et montre \u2013 \u00e0 ce que je crois \u2013 que leur formulation repose sur une mauvaise compr\u00e9hension de la logique de notre langue. On pourrait r\u00e9sumer en quelque sorte tout le sens du livre en ces termes\u00a0: tout ce qui proprement peut \u00eatre dit peut \u00eatre dit clairement, et sur ce dont on ne peut parler, il faut garder le silence.',
    'Le livre tracera donc une fronti\u00e8re \u00e0 l\u2019acte de penser, \u2013 ou plut\u00f4t non pas \u00e0 l\u2019acte de penser, mais \u00e0 l\u2019expression des pens\u00e9es\u00a0: car pour tracer une fronti\u00e8re \u00e0 l\u2019acte de penser, nous devrions pouvoir penser les deux c\u00f4t\u00e9s de cette fronti\u00e8re (nous devrions donc pouvoir penser ce qui ne se laisse pas penser).',
    'La fronti\u00e8re ne pourra donc \u00eatre trac\u00e9e que dans la langue, et ce qui est au-del\u00e0 de cette fronti\u00e8re sera simplement d\u00e9pourvu de sens.',
    'Jusqu\u2019\u00e0 quel point mes efforts co\u00efncident avec ceux d\u2019autres philosophes, je n\u2019en veux pas juger. En v\u00e9rit\u00e9, ce que j\u2019ai ici \u00e9crit n\u2019\u00e9l\u00e8ve dans son d\u00e9tail absolument aucune pr\u00e9tention \u00e0 la nouveaut\u00e9\u00a0; et c\u2019est pourquoi je ne donne pas non plus de sources, car il m\u2019est indiff\u00e9rent que ce que j\u2019ai pens\u00e9, un autre l\u2019ait d\u00e9j\u00e0 pens\u00e9 avant moi.',
    'Je veux seulement mentionner qu\u2019aux \u0153uvres grandioses de Frege et aux travaux de mon ami M. Bertrand Russell je dois, pour une grande part, la stimulation de mes pens\u00e9es.',
    'Si ce travail a quelque valeur, elle consiste en deux choses distinctes. Premi\u00e8rement, en ceci, que des pens\u00e9es y sont exprim\u00e9es, et cette valeur sera d\u2019autant plus grande que les pens\u00e9es y sont mieux exprim\u00e9es. D\u2019autant mieux on aura frapp\u00e9 sur la t\u00eate du clou. Je suis conscient, sur ce point, d\u2019\u00eatre rest\u00e9 bien loin en de\u00e7\u00e0 du possible. Simplement parce que mes forces sont trop modiques pour dominer la t\u00e2che. Puissent d\u2019autres venir qui feront mieux.',
    'N\u00e9anmoins, la v\u00e9rit\u00e9 des pens\u00e9es ici communiqu\u00e9es me semble intangible et d\u00e9finitive. Mon opinion est donc que j\u2019ai, pour l\u2019essentiel, r\u00e9solu les probl\u00e8mes d\u2019une mani\u00e8re d\u00e9cisive. Et si en cela je ne me trompe pas, la valeur de ce travail consiste alors, en second lieu, en ceci, qu\u2019il montre combien peu a \u00e9t\u00e9 fait quand ces probl\u00e8mes ont \u00e9t\u00e9 r\u00e9solus.',
  ],
  signature: 'L.W.',
  location: 'Vienne, 1918.',
  showButton: 'Afficher l\u2019avant-propos',
  hideButton: 'Masquer l\u2019avant-propos',
};

export const prefaceDE: PrefaceData = {
  dedicationLabel: 'Widmung',
  dedication: [
    'Dem Andenken meines Freundes',
    'DAVID H. PINSENT',
    'gewidmet',
  ],
  mottoLabel: 'Motto',
  motto: '\u2026 und alles, was man weiss, nicht bloss rauschen und brausen geh\u00f6rt hat, l\u00e4sst sich in drei Worten sagen.',
  mottoAuthor: 'K\u00fcrnberger',
  prefaceLabel: 'Vorwort',
  prefaceParagraphs: [
    'Dieses Buch wird vielleicht nur der verstehen, der die Gedanken, die darin ausgedr\u00fcckt sind \u2013 oder doch \u00e4hnliche Gedanken \u2013 schon selbst einmal gedacht hat. \u2013 Es ist also kein Lehrbuch. \u2013 Sein Zweck w\u00e4re erreicht, wenn es Einem, der es mit Verst\u00e4ndnis liest Vergn\u00fcgen bereitete.',
    'Das Buch behandelt die philosophischen Probleme und zeigt \u2013 wie ich glaube \u2013 dass die Fragestellung dieser Probleme auf dem Missverst\u00e4ndnis der Logik unserer Sprache beruht. Man k\u00f6nnte den ganzen Sinn des Buches etwa in die Worte fassen: Was sich \u00fcberhaupt sagen l\u00e4sst, l\u00e4sst sich klar sagen; und wovon man nicht reden kann, dar\u00fcber muss man schweigen.',
    'Das Buch will also dem Denken eine Grenze ziehen, oder vielmehr \u2013 nicht dem Denken, sondern dem Ausdruck der Gedanken: Denn um dem Denken eine Grenze zu ziehen, m\u00fcssten wir beide Seiten dieser Grenze denken k\u00f6nnen (wir m\u00fcssten also denken k\u00f6nnen, was sich nicht denken l\u00e4sst).',
    'Die Grenze wird also nur in der Sprache gezogen werden k\u00f6nnen und was jenseits der Grenze liegt, wird einfach Unsinn sein.',
    'Wieweit meine Bestrebungen mit denen anderer Philosophen zusammenfallen, will ich nicht beurteilen. Ja, was ich hier geschrieben habe macht im Einzelnen \u00fcberhaupt nicht den Anspruch auf Neuheit; und darum gebe ich auch keine Quellen an, weil es mir gleichg\u00fcltig ist, ob das was ich gedacht habe, vor mir schon ein anderer gedacht hat.',
    'Nur das will ich erw\u00e4hnen, dass ich den grossartigen Werken Freges und den Arbeiten meines Freundes Herrn Bertrand Russell einen grossen Teil der Anregung zu meinen Gedanken schulde.',
    'Wenn diese Arbeit einen Wert hat, so besteht er in Zweierlei. Erstens darin, dass in ihr Gedanken ausgedr\u00fcckt sind, und dieser Wert wird umso gr\u00f6sser sein, je besser die Gedanken ausgedr\u00fcckt sind. Je mehr der Nagel auf den Kopf getroffen ist. \u2013 Hier bin ich mir bewusst, weit hinter dem M\u00f6glichen zur\u00fcckgeblieben zu sein. Einfach darum, weil meine Kraft zur Bew\u00e4ltigung der Aufgabe zu gering ist. \u2013 M\u00f6gen andere kommen und es besser machen.',
    'Dagegen scheint mir die Wahrheit der hier mitgeteilten Gedanken unantastbar und definitiv. Ich bin also der Meinung, die Probleme im Wesentlichen endg\u00fcltig gel\u00f6st zu haben. Und wenn ich mich hierin nicht irre, so besteht nun der Wert dieser Arbeit zweitens darin, dass sie zeigt, wie wenig damit getan ist, dass diese Probleme gel\u00f6st sind.',
  ],
  signature: 'L. W.',
  location: 'Wien, 1918.',
  showButton: 'Vorwort anzeigen',
  hideButton: 'Vorwort ausblenden',
};
