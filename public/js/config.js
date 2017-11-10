var links = document.querySelectorAll('.links'),
  proLinks = document.querySelectorAll('.profile-links'),
  id,
  url;

links.forEach(function(val) {
  (id = val.dataset.id), (url = `/poll/${id}`);

  val.href = url;
});

proLinks.forEach(function(val) {
  (id = val.dataset.id), (url = `/edit/${id}`);

  val.href = url;
});
