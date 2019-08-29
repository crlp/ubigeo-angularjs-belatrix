


var app = angular.module('app', []);


app.controller('mainCtrl', function ($scope, $timeout) {

	$scope.types 			= { departamento: "dep", provincia: "pro", distrito: "dis" };
	$scope.dataInitial 		= []
	$scope.departamentos 	= []
	$scope.provincias 		= []
	$scope.distritos 		= []

	$scope.showContent = function ($fileContent) {
		$scope.content = $fileContent;
	};

	$scope.setDataArray = function (value, type) {
		if (type && value) {
			let arrHijo = [];
			let arrPadre = [];
			let arrNivel0 = [];
			let objItem = {};

			if (type === $scope.types.departamento) {
				arrHijo = $scope.detectFirstSpace(value[0].trim());
				objItem = { codigo: arrHijo[0], descripcion: arrHijo[1] };
				if (!$scope.existInArray($scope.departamentos, objItem.codigo)) {
					$scope.departamentos.push(objItem);
				}
			} else if (type === $scope.types.provincia) {
				arrHijo = $scope.detectFirstSpace(value[1].trim());
				arrPadre = $scope.detectFirstSpace(value[0].trim());
				objItem = {
					codigo: arrHijo[0],
					descripcion: arrHijo[1],
					codigoDepartamento: arrPadre[0],
					descripcionDepartamento: arrPadre[1]
				};
				if (!$scope.existInArray($scope.provincias, objItem.codigo)) {
					$scope.provincias.push(objItem);
				}
			} else if (type === $scope.types.distrito) {
				arrHijo = $scope.detectFirstSpace(value[2].trim());
				arrNivel0 = $scope.detectFirstSpace(value[1].trim());
				arrPadre = $scope.detectFirstSpace(value[0].trim());
				objItem = {
					codigo: arrHijo[0],
					descripcion: arrHijo[1],
					codigoDepartamento: arrPadre[0],
					descripcionDepartamento: arrPadre[1],
					codigoProvincia: arrNivel0[0],
					descripcionProvincia: arrNivel0[1]
				};
				if (!$scope.existInArray($scope.distritos, objItem.codigo)) {
					$scope.distritos.push(objItem);
				}
			}
		}
	},
	$scope.llenarData = function () {
		let indicador = 0;
		$scope.dataInitial.forEach(item => {
			$scope.setDataArray(item, $scope.types.departamento);
			indicador = item.length;
			switch (indicador) {
				case 2:
					$scope.setDataArray(item, $scope.types.provincia);
					break;
				case 3:
					$scope.setDataArray(item, $scope.types.distrito);
					break;
				default:
					break;
			}
		});

		$timeout(function(){ 
			$scope.departamentosI = $scope.departamentos;
			$scope.provinciasI = $scope.provincias;
			$scope.distritosI = $scope.distritos; 
		}, 0)
	},

	$scope.existInArray = function (array, codDepartamento) {
		let c = 0;
		array.forEach(item => {
			if (item.codigo === codDepartamento) {
				c++;
			}
		});
		return c > 0;
	},

	$scope.detectFirstSpace = function (text) {
		let arrayClean = [];
		for (let i = -1; (i = text.indexOf(" ", i + 1)) != -1; i++) {
			arrayClean.push(text.substring(0, i));
			arrayClean.push(text.substring(i + 1, text.length));
		}
		return arrayClean;
	};
});

app.directive('onReadFile', function ($parse) {
	return {

		link: function (scope, element, attrs) {
			var fn = $parse(attrs.onReadFile);
			element.on('change', function (onChangeEvent) {
				var reader = new FileReader();
				let self = this;

				reader.onload = function (onLoadEvent) {
					scope.$apply(function () {
						fn(scope, { $fileContent: onLoadEvent.target.result });

						self.fileContent = onLoadEvent.target.result;
						var lines = self.fileContent.split("\n");

						lines.forEach(element => {
							let arrayContent = element.split("/");
							let arrayContentClear = [];
							arrayContent.forEach(element => {
								if (element.trim() != "") {
									arrayContentClear.push(element);
								}
							});
							scope.dataInitial.push(arrayContentClear);
						});
					});

					scope.llenarData();
					


				};
				reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
			});
		}
	};
});

