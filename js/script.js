/* Assigned to: Yang Angran
   Gallery photograph records and image source information. */
// 图片资料按数组顺序存放
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
  },
  {
    "id": "atkins",
    "name": "Anna Atkins",
    "title": "Dictyota dichotoma, in the young state; and in fruit",
    "date": "1843–1853",
    "alt": "White branching algae shapes on a blue cyanotype background",
    "source": "https://commons.wikimedia.org/wiki/File:Anna_Atkins_algae_cyanotype.jpg"
  },
  {
    "id": "muybridge",
    "name": "Eadweard Muybridge",
    "title": "The Horse in Motion",
    "date": "1878",
    "alt": "A sequence of small photographs showing the successive positions of a galloping horse",
    "source": "https://commons.wikimedia.org/wiki/File:The_Horse_in_Motion.jpg"
  },
  {
    "id": "talbot",
    "name": "William Henry Fox Talbot",
    "title": "Latticed Window at Lacock Abbey",
    "date": "1835",
    "alt": "A print showing the geometric panes of a latticed window at Lacock Abbey",
    "source": "https://www.edinphoto.org.uk/1_P/1_photographers_talbot_smm_latticed_window.htm"
  }
];

/* Assigned to: Wei Junze
   Quiz answers and explanations. */
// 选项从 0 开始编号，correct 是正确选项
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

/* Assigned to: Xu Jiale
   Shared page setup and home page date display. */
$(function () {
  // 首页内容淡入显示
  $('.hero').hide().fadeIn(500);

  $('#current-date').text(new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  }));

  /* Assigned to: Xu Jiale
     Fade the photographer stories in and out with jQuery. */
  // 点击按钮展开或收起介绍
  $('.story-details').hide();
  $('.story-toggle').attr('aria-expanded', 'false').text('Read the story');
  $('.story-toggle').on('click', function () {
    var expanded = $(this).attr('aria-expanded') === 'true';
    var duration = 300;
    $('#' + $(this).attr('aria-controls')).fadeToggle(duration);
    if (expanded) {
      $(this).attr('aria-expanded', 'false').text('Read the story');
    } else {
      $(this).attr('aria-expanded', 'true').text('Close the story');
    }
  });

  /* Assigned to: Yang Angran
     Category filters, photograph preview and previous/next controls. */
  var visibleImages = [];
  for (var imageIndex = 0; imageIndex < photographs.length; imageIndex++) {
    visibleImages.push(imageIndex);
  }
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
      if (show) {
        $(this).hide().prop('hidden', false).fadeIn(350);
      } else {
        $(this).prop('hidden', true);
      }
      if (show) {
        var imageNumber = Number($(this).find('button').attr('data-index'));
        visibleImages.push(imageNumber);
      }
    });
    if (visibleImages.length === 1) {
      $('#gallery-status').text('Showing 1 photograph');
    } else {
      $('#gallery-status').text('Showing ' + visibleImages.length + ' photographs');
    }
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
    // 到最后一张后回到第一张，反方向也一样
    position = position + direction;
    if (position >= visibleImages.length) {
      position = 0;
    }
    if (position < 0) {
      position = visibleImages.length - 1;
    }
    // 先淡出旧图片，再换图并淡入
    $('#previous-image, #next-image').prop('disabled', true);
    $('#viewer-image').fadeOut(180, function () {
      showImage(visibleImages[position]);
      $('#previous-image, #next-image').prop('disabled', true);
      $('#viewer-image').fadeIn(250, function () {
        $('#previous-image, #next-image').prop('disabled', visibleImages.length < 2);
      });
    });
  }
  $('.gallery-open').on('click', function () {
    lastImageButton = this;
    showImage(Number($(this).attr('data-index')));
    $('#image-viewer').hide().prop('hidden', false).fadeIn(300, function () {
      $('#close-viewer').trigger('focus');
    });
  });
  $('#close-viewer').on('click', function () {
    $('#close-viewer').prop('disabled', true);
    $('#image-viewer').fadeOut(250, function () {
      $('#image-viewer').prop('hidden', true);
      $('#close-viewer').prop('disabled', false);
      if (lastImageButton) {
        lastImageButton.focus();
      }
    });
  });
  $('#previous-image').on('click', function () {
    moveImage(-1);
  });
  $('#next-image').on('click', function () {
    moveImage(1);
  });


  /* Assigned to: Wei Junze
     Save, load and clear the latest quiz result using LocalStorage. */
  function showSavedScore() {
    // 读取上一次保存在浏览器里的成绩
    var saved = localStorage.getItem('lensLegacyQuiz');
    if (saved) {
      var result = JSON.parse(saved);
      $('#last-score').text('Latest saved score: ' + result.score + '/6 · ' + result.date);
    } else {
      $('#last-score').text('No score saved on this device.');
    }
  }
  if ($('#quiz-form').length) {
    showSavedScore();
  }
  $('#clear-score').on('click', function () {
    localStorage.removeItem('lensLegacyQuiz');
    showSavedScore();
  });

  /* Assigned to: Wei Junze
     Check unanswered questions, calculate scores and show explanations. */
  $('#quiz-form').on('submit', function (event) {
    event.preventDefault();
    // 先检查有没有漏答，再开始计分
    var missing = -1;
    for (var i = 0; i < quizAnswers.length; i++) {
      var selectedAnswer = $('input[name="q' + i + '"]:checked');
      if (selectedAnswer.length === 0 && missing === -1) {
        missing = i;
      }
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
      if (correct) {
        score = score + 1;
        $('#feedback-' + j).text('Correct. ' + quizAnswers[j].explanation);
      } else {
        $('#feedback-' + j).text('Not quite. ' + quizAnswers[j].explanation);
      }
    }
    var resultHeading = 'Your quiz result';
    if (score === 6) {
      resultHeading = 'All answers correct!';
    }
    // 将分数写到页面上的结果区域
    $('#quiz-result-heading').text(resultHeading);
    $('#quiz-result-score').text(score + ' / 6');
    // 检查答案后，成绩淡入显示
    $('#quiz-result').hide().prop('hidden', false).fadeIn(350, function () {
      $('#quiz-result').trigger('focus');
    });
    if ($('#save-score').is(':checked')) {
      localStorage.setItem('lensLegacyQuiz', JSON.stringify({ score: score, date: new Date().toLocaleDateString('en-GB') }));
      showSavedScore();
    }
  });
  $('#quiz-form').on('reset', function () {
    $('.answer-feedback, #quiz-error').text('');
    $('#quiz-result').prop('hidden', true);
  });

  /* Assigned to: Gao Qianchen
     Character counter, field validation, email regex and message display. */
  // 输入留言时显示当前字数
  $('#message').on('input', function () {
    $('#character-count').text($(this).val().length);
  });
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
      $('#' + field + '-error').hide().text(text).fadeIn(200);
      $('#' + field).attr('aria-invalid', 'true');
      if (firstInvalid === '') {
        firstInvalid = field;
      }
    }
    if (name.length < 2 || name.length > 60) {
      reportError('name', 'Please enter a name between 2 and 60 characters.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 100) {
      reportError('email', 'Please enter a valid email address, such as alex@example.com.');
    }
    if (!subject) {
      reportError('subject', 'Please choose a subject.');
    }
    if (message.length < 10 || message.length > 600) {
      reportError('message', 'Please enter a message between 10 and 600 characters.');
    }
    if (!$('#consent').is(':checked')) {
      reportError('consent', 'Please check your details and tick the box.');
    }
    if (firstInvalid) {
      $('#contact-status').text('Please correct the highlighted fields.');
      $('#' + firstInvalid).trigger('focus');
      $('#contact-result').prop('hidden', true);
      return;
    }
    // 用 text 显示留言，避免把输入内容当作 HTML
    $('#result-name').text(name);
    $('#result-email').text(email);
    $('#result-subject').text(subject);
    $('#result-message').text(message);
    // 验证通过后，表单淡出，留言结果淡入
    $('#contact-form button').prop('disabled', true);
    $('#contact-form').fadeOut(250, function () {
      $('#contact-form').prop('hidden', true);
      $('#contact-form button').prop('disabled', false);
      $('#contact-result').hide().prop('hidden', false).fadeIn(300, function () {
        $('#contact-result').trigger('focus');
      });
    });
  });
  $('#edit-message').on('click', function () {
    $('#edit-message').prop('disabled', true);
    $('#contact-result').fadeOut(250, function () {
      $('#contact-result').prop('hidden', true);
      $('#edit-message').prop('disabled', false);
      $('#contact-form').hide().prop('hidden', false).fadeIn(300, function () {
        $('#name').trigger('focus');
      });
    });
  });
});
