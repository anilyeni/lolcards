var champsurl = '/api.php?champions=1';
var itemsurl = '/api.php?items=1';

var imageBaseUrl = 'http://ddragon.leagueoflegends.com/cdn/6.8.1/img/';
var loadingBaseUrl = 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/';
var totalMaxLevel = 18;
(function() {
    var app = angular.module('lol', ['ui.bootstrap']);

    app.controller('CharacterController', ['$scope', '$http', '$uibModal','svc','calc', function($scope, $http, $uibModal, svc, calc) {
        var char = this;
        this.computerSelects = [];
        $scope.calc = calc;
        $scope.imageBaseUrl = imageBaseUrl;
        $scope.loadingBaseUrl = loadingBaseUrl;
        $scope.htmlPopover = ('<b style="color: red">I can</b> have <div class="label label-success">HTML</div> content');
        svc.setMode('initial');

        this.getMode = function () {
            return svc.getMode();
        };

        this.isCollapsed = function () {
            return svc.getMode() != 'initial';
        };

        this.lockIn = function () {
            svc.setMode('game');
            char.computerSelects = svc.getRandomChars();
        };

        $http.get(champsurl).success(function(result) {
            char.chars = result.data;
            svc.setCharacters(result.data);
        });

        $http.get(itemsurl).success(function(result) {
            char.items = result.data;
            svc.setItems(result.data);
        });

        this.imageBaseUrl = 'http://ddragon.leagueoflegends.com/cdn/6.8.1/img/';
        this.loadingBaseUrl = 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/';

        this.selects = [];
        this.select = function(selectedChar) {
            if(selectedChar.selected) return false;
            selectedChar.selected = true;
            selectedChar.level = function () {
                var level = 0;
                selectedChar.spells.forEach(function(spell) {
                    level += spell.level;
                });

                return level;
            };

            selectedChar.items = [
                false, false, false, false
            ];

            selectedChar.spells.forEach(function(spell) {
                spell.level = 0;
            });

            this.selects.unshift(selectedChar);
            if(this.selects.length > 3) {
                var poped = this.selects.pop();
                poped.selected = false;
                poped.items = [
                    false, false, false, false
                ];
                selectedChar.spells.forEach(function(spell) {
                    spell.level = 0;
                })
            }
        };

        this.totalLevel = function() {
            var total = 0;
            this.selects.forEach(function(select) {
                total += select.level();
            });
            
            return totalMaxLevel - total;
        };

        this.open = function (select, index) {
            $uibModal.open({
                templateUrl: '/js/lol/template/items-modal.html',
                controller : 'ItemsController',
                controllerAs: 'itemsCtrl',
                resolve: {
                    items: function () {
                        return char.items;
                    },
                    char : function () {
                        return select;
                    },
                    index : function () {
                        return index;
                    },
                }
            });

        };

        this.spellClick = function (spell) {
            if(this.getMode() == 'initial') {
                this.spellUp(spell);
            }

            if(this.getMode() == 'game') {
                console.log(spell);
            }
        };

        this.spellUp = function (spell) {
            if(spell.level < 5 && this.totalLevel() > 0) {
                spell.level += 1;
            }
        };


        this.calcTotalGold = function () {
            var total = 0;
            this.selects.forEach(function(select) {
                select.items.forEach(function (item) {
                    if(item != false) {
                        total += item.gold.total;
                    }

                });
            });

            return 5000 - total;
        };

        svc.setSelects(this.selects);
    }]);

    app.controller('ItemsController', ['$scope', '$uibModalInstance', 'char', 'items', 'index', 'svc', function ($scope, $uibModalInstance, char, items, index, svc) {
        $scope.imageBaseUrl = imageBaseUrl;
        this.char = char;
        this.items = items;

        this.select = function(item) {

            if(char.items[index] == item) {
                this.unselect(index);
                return;
            }
            if(this.isSelected(item)){
                return false;
            }
            if(item.gold.total > this.calcTotalGold()) {
                $uibModalInstance.close();
                return false;
            }
            char.items[index] = item;
            $uibModalInstance.close();
        };

        this.unselect = function(index) {
            char.items[index] = false;
        };
        
        this.isSelected = function(i) {
            var r = false;
            char.items.forEach(function (e) {
                if(e.id == i.id) {
                    r = true;
                }
            });

            return r;
        };

        this.calcTotalGold = function () {
            var total = 0;
            svc.getSelects().forEach(function(select) {
                select.items.forEach(function (item) {
                    if(item != false) {
                        total += item.gold.total;
                    }

                });
            });

            return 5000 - total;
        };

    }]);

    app.service('svc', function() {
        var svc = {};

        svc.setCharacters = function(characters) {
            svc.characters = characters;
        };

        svc.getCharacters = function() {
            return svc.characters;
        };

        svc.setItems = function(items) {
            svc.items = items;
        };

        svc.getItems = function() {
            return svc.items;
        };

        svc.setSelects = function(selects) {
            svc.selects = selects;
        };

        svc.getSelects = function() {
            return svc.selects;
        };

        svc.setMode = function(mode) {
            svc.mode = mode;
        };

        svc.getMode = function() {
            return svc.mode;
        };

        svc.getRandomChar = function () {
            var chars = svc.getCharacters();
            var charKeys = Object.keys(svc.getCharacters());
            var c = charKeys[Math.floor(Math.random()*charKeys.length)];
            var char = chars[c];

            char.level = function () {
                var level = 0;
                char.spells.forEach(function(spell) {
                    level += spell.level;
                });

                return level;
            };
            char.items = [
                false, false, false, false
            ];

            char.spells.forEach(function(spell) {
                spell.level = 0;
            });
            return char;
        };

        svc.getRandomChars = function () {
            return [
                svc.getRandomChar(),
                svc.getRandomChar(),
                svc.getRandomChar()
            ];
        };

        return svc;
    });

    app.service('calc', function() {
        var calc = {};

        calc.calcAttackDamage = function (char) {
            var base = (char.stats.attackdamage + ( char.level() * char.stats.attackdamageperlevel) );
            var baseMod = 0;
            char.items.forEach(function (item) {
                if(item != false) {
                    if ('FlatPhysicalDamageMod' in item.stats) {
                        baseMod += item.stats.FlatPhysicalDamageMod;
                    }
                }
            });

            return (base + baseMod);
        };

        calc.calcMagicDamage = function (char) {
            var base = 0;
            var baseMod = 0;
            char.items.forEach(function (item) {
                if(item != false) {
                    if ('FlatMagicDamageMod' in item.stats) {
                        baseMod += item.stats.FlatMagicDamageMod;
                    }
                }
            });

            return (base + baseMod);
        };

        calc.calcArmor = function (char) {
            var base = (char.stats.armor + char.level() * char.stats.armorperlevel);
            var baseMod = 0;
            char.items.forEach(function (item) {
                if(item != false) {
                    if ('FlatArmorMod' in item.stats) {
                        baseMod += item.stats.FlatArmorMod;
                    }
                }
            });

            return (base + baseMod);
        };

        calc.calcMR = function (char) {
            var base = (char.stats.spellblock + char.level() * char.stats.spellblockperlevel);
            var baseMod = 0;
            char.items.forEach(function (item) {
                if(item != false) {
                    if ('FlatSpellBlockMod' in item.stats) {
                        baseMod += item.stats.FlatSpellBlockMod;
                    }
                }
            });

            return (base + baseMod);
        };

        calc.calcHP = function (char) {
            var base = (char.stats.hp + char.level() * char.stats.hpperlevel);
            var baseMod = 0;
            char.items.forEach(function (item) {
                if(item != false) {
                    if ('FlatHPPoolMod' in item.stats) {
                        baseMod += item.stats.FlatHPPoolMod;
                    }
                }
            });

            return (base + baseMod);
        };

        calc.calcMP = function (char) {
            var base = (char.stats.mp + char.level() * char.stats.mpperlevel);
            var baseMod = 0;
            char.items.forEach(function (item) {
                if(item != false) {
                    if ('FlatMPPoolMod' in item.stats) {
                        baseMod += item.stats.FlatMPPoolMod;
                    }
                }
            });

            return (base + baseMod);
        };

        return calc;
    })

})();