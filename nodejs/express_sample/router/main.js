module.exports = (pApp, pFs) => {
	pApp.get('/',(pRequest, pResponse) => {
		pResponse.render('index');
	});
	pApp.get('/:category',(pRequest, pResponse) => {
		pResponse.render(pRequest.params.category);
	});
};