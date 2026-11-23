/* Gallery records and quiz answers. */
var photographs = [
  {
    "id": "adams",
    "name": "Ansel Adams",
    "title": "Long’s Peak, Rocky Mountain National Park",
    "date": "1941",
    "alt": "Dark forested hills beneath the distant mountains of Rocky Mountain National Park",
    "source": "https://commons.wikimedia.org/wiki/File:Ansel_Adams_-_National_Archives_79-AA-M10.jpg"
  },
  {
    "id": "lange",
    "name": "Dorothea Lange",
    "title": "Migrant Mother",
    "date": "1936",
    "alt": "Florence Owens Thompson with her children close beside her in Migrant Mother",
    "source": "https://commons.wikimedia.org/wiki/File:Lange-MigrantMother02.jpg"
  },
  {
    "id": "atget",
    "name": "Eugène Atget",
    "title": "Marché des Patriarches, Paris",
    "date": "1924",
    "alt": "A historic Paris street and market buildings photographed by Eugene Atget",
    "source": "https://commons.wikimedia.org/wiki/File:Marché_des_Patriarches_2_1924_-_Atget.jpg"
  },
  {
    "id": "cameron",
    "name": "Julia Margaret Cameron",
    "title": "Sir John Frederick William Herschel",
    "date": "1867",
    "alt": "A close portrait of the scientist John Herschel with long white hair",
    "source": "https://commons.wikimedia.org/wiki/File:Julia_Margaret_Cameron_-_Sir_John_Frederick_William_Herschel_-_Google_Art_Project.jpg"
  },
  {
    "id": "hine",
    "name": "Lewis Hine",
    "title": "Adolescent Girl, a Spinner, in a Carolina Cotton Mill",
    "date": "1908",
    "alt": "A young textile worker stands beside a long row of spinning machines",
    "source": "https://commons.wikimedia.org/wiki/File:Hine,_Lewis,_Adolescent_Girl,_a_Spinner,_in_a_Carolina_Cotton_Mill,_1908.jpg"
  },
  {
    "id": "parks",
    "name": "Gordon Parks",
    "title": "American Gothic, Washington, D.C.",
    "date": "1942",
    "alt": "Ella Watson stands with cleaning tools in front of an American flag",
    "source": "https://commons.wikimedia.org/wiki/File:Gordon_Parks_-_American_Gothic.jpg"
  }
];

var quizAnswers = [
  {
    "correct": 0,
    "explanation": "Adams photographed the American West, including its mountain landscapes."
  },
  {
    "correct": 1,
    "explanation": "Dorothea Lange made Migrant Mother in Nipomo, California."
  },
  {
    "correct": 2,
    "explanation": "Atget photographed the streets, buildings and details of Paris."
  },
  {
    "correct": 1,
    "explanation": "Cameron explored character and expression through portrait photography."
  },
  {
    "correct": 0,
    "explanation": "Hine documented child labour for the National Child Labor Committee."
  },
  {
    "correct": 2,
    "explanation": "Parks photographed Ella Watson, a government cleaning worker, in 1942."
  }
];

/* Shared navigation and date */
$(function () {
  $('#current-date').text(new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  }));

  /* Photographer stories use a simple jQuery effect. */
  $('.story-details').hide();
  $('.story-toggle').attr('aria-expanded', 'false').text('Read the story');
  $('.story-toggle').on('click', function () {
    var expanded = $(this).attr('aria-expanded') === 'true';
    var duration = 200;
    $('#' + $(this).attr('aria-controls')).stop(true, true).slideToggle(duration);
    $(this).attr('aria-expanded', !expanded).text(expanded ? 'Read the story' : 'Close the story');
  });

  /* Gallery filters */
  var visibleImages = [0, 1, 2, 3, 4, 5];
  var currentImage = 0;
  var lastImageButton;
  $('.filter-button').on('click', function () {
    var category = $(this).attr('data-filter');
    $('.filter-button').removeClass('selected').attr('aria-pressed', 'false');
    $(this).addClass('selected').attr('aria-pressed', 'true');
    $('#image-viewer').prop('hidden', true);
    visibleImages = [];
    $('.gallery-item').each(function () {
      var show = category === 'All' || $(this).attr('data-category') === category;
      $(this).prop('hidden', !show);
      if (show) visibleImages.push(Number($(this).find('button').attr('data-index')));
    });
    $('#gallery-status').text('Showing ' + visibleImages.length + (visibleImages.length === 1 ? ' photograph' : ' photographs'));
  });

  function showImage(index) {
    currentImage = index;
    var photo = photographs[index];
    $('#viewer-image').attr('src', 'images/' + photo.id + '.jpg').attr('alt', photo.alt);
    $('#viewer-title').text(photo.title);
    $('#viewer-caption').text(photo.name + ' · ' + photo.date);
    $('#viewer-source').attr('href', photo.source).attr('target', '_blank').attr('rel', 'noopener');
    $('#viewer-count').text((visibleImages.indexOf(index) + 1) + ' / ' + visibleImages.length);
    $('#previous-image, #next-image').prop('disabled', visibleImages.length < 2);
  }
  function moveImage(direction) {
    var position = visibleImages.indexOf(currentImage);
    position = (position + direction + visibleImages.length) % visibleImages.length;
    showImage(visibleImages[position]);
  }
  $('.gallery-open').on('click', function () {
    lastImageButton = this;
    showImage(Number($(this).attr('data-index')));
    $('#image-viewer').prop('hidden', false);
    document.getElementById('image-viewer').scrollIntoView();
    $('#close-viewer').trigger('focus');
  });
  $('#close-viewer').on('click', function () {
    $('#image-viewer').prop('hidden', true);
    if (lastImageButton) lastImageButton.focus();
  });
  $('#previous-image').on('click', function () { moveImage(-1); });
  $('#next-image').on('click', function () { moveImage(1); });


  /* Local storage is optional. The quiz still works if storage is blocked. */
  function showSavedScore() {
    try {
      var saved = localStorage.getItem('lensLegacyQuiz');
      if (saved) {
        var result = JSON.parse(saved);
        $('#last-score').text('Latest saved score: ' + result.score + '/6 · ' + result.date);
      } else {
        $('#last-score').text('No score saved on this device.');
      }
    } catch (error) {
      $('#last-score').text('Storage is unavailable. You can still take the quiz.');
    }
  }
  if ($('#quiz-form').length) showSavedScore();
  $('#clear-score').on('click', function () {
    try {
      localStorage.removeItem('lensLegacyQuiz');
      showSavedScore();
    } catch (error) { $('#last-score').text('Storage is unavailable in this browser.'); }
  });

  /* Quiz validation, scoring and answer explanations */
  $('#quiz-form').on('submit', function (event) {
    event.preventDefault();
    var missing = -1;
    for (var i = 0; i < quizAnswers.length; i++) {
      if (!$('input[name="q' + i + '"]:checked').length && missing === -1) missing = i;
    }
    if (missing !== -1) {
      $('#quiz-error').text('Please answer all six questions before checking your answers.');
      $('input[name="q' + missing + '"]').first().trigger('focus');
      return;
    }
    var score = 0;
    $('#quiz-error').text('');
    for (var j = 0; j < quizAnswers.length; j++) {
      var answer = Number($('input[name="q' + j + '"]:checked').val());
      var correct = answer === quizAnswers[j].correct;
      if (correct) score++;
      $('#feedback-' + j).text((correct ? 'Correct. ' : 'Not quite. ') + quizAnswers[j].explanation);
    }
    $('#quiz-result').empty().prop('hidden', false)
      .append($('<p>').addClass('eyebrow').text('YOUR RESULT'))
      .append($('<h2>').text(score === 6 ? 'All answers correct!' : 'Your quiz result'))
      .append($('<p>').addClass('score').text(score + ' / 6'))
      .append($('<p>').text('Review the explanation below each question, then revisit the photographer stories.'));
    if ($('#save-score').is(':checked')) {
      try {
        localStorage.setItem('lensLegacyQuiz', JSON.stringify({ score: score, date: new Date().toLocaleDateString('en-GB') }));
        showSavedScore();
      } catch (error) { $('#last-score').text('Your score could not be saved, but your result is shown below.'); }
    }
    $('#quiz-result').trigger('focus');
  });
  $('#quiz-form').on('reset', function () {
    $('.answer-feedback, #quiz-error').text('');
    $('#quiz-result').prop('hidden', true).empty();
  });

  /* Contact form: field-specific validation and a safe DOM preview */
  $('#message').on('input', function () { $('#character-count').text($(this).val().length); });
  $('#contact-form').on('submit', function (event) {
    event.preventDefault();
    var name = $('#name').val().trim();
    var email = $('#email').val().trim();
    var subject = $('#subject').val();
    var message = $('#message').val().trim();
    var firstInvalid = '';
    $('.error').text('');
    $('#contact-form input, #contact-form select, #contact-form textarea').attr('aria-invalid', 'false');

    function reportError(field, text) {
      $('#' + field + '-error').text(text);
      $('#' + field).attr('aria-invalid', 'true');
      if (!firstInvalid) firstInvalid = field;
    }
    if (name.length < 2 || name.length > 60) reportError('name', 'Please enter a name between 2 and 60 characters.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 100) reportError('email', 'Please enter a valid email address, such as alex@example.com.');
    if (!subject) reportError('subject', 'Please choose a subject.');
    if (message.length < 10 || message.length > 600) reportError('message', 'Please enter a message between 10 and 600 characters.');
    if (!$('#consent').is(':checked')) reportError('consent', 'Please confirm that you understand this is a demonstration.');
    if (firstInvalid) {
      $('#contact-status').text('Please correct the highlighted fields.');
      $('#' + firstInvalid).trigger('focus');
      $('#contact-result').prop('hidden', true);
      return;
    }
    // text() displays user input as text, never as executable HTML.
    $('#result-name').text(name);
    $('#result-email').text(email);
    $('#result-subject').text(subject);
    $('#result-message').text(message);
    $('#contact-form').prop('hidden', true);
    $('#contact-result').prop('hidden', false).trigger('focus');
  });
  $('#edit-message').on('click', function () {
    $('#contact-result').prop('hidden', true);
    $('#contact-form').prop('hidden', false);
    $('#name').trigger('focus');
  });
});
