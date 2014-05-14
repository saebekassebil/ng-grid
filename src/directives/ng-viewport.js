ngGridDirectives.directive('ngViewport', [function() {
    return function($scope, elm) {
        var isMouseWheelActive;
        var prevScrollLeft;
        var prevScrollTop;
        var ensureDigest = function() {
            if (!$scope.$root.$$phase) {
                $scope.$digest();
            }
        };
        var scrollTimer;

        function scroll (evt) {
            var scrollLeft = evt.target.scrollLeft,
                scrollTop = evt.target.scrollTop;
            if ($scope.$headerContainer) {
                $scope.$headerContainer.scrollLeft(scrollLeft);
            }

            if (scrollLeft !== prevScrollLeft) {
              $scope.adjustScrollLeft(scrollLeft);
            }

            if (scrollTop !== prevScrollTop) {
              $scope.adjustScrollTop(scrollTop);
            }

            if ($scope.forceSyncScrolling) {
                ensureDigest();
            } else {
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(ensureDigest, 150);   
            }
            prevScrollLeft = scrollLeft;
            prevScrollTop = scrollTop;
            isMouseWheelActive = false;
            return true;
        }

        elm.bind('scroll', scroll);

        function mousewheel() {
            isMouseWheelActive = true;
            if (elm.focus) { elm.focus(); }
            return true;
        }

        elm.bind("mousewheel DOMMouseScroll", mousewheel);

        elm.on('$destroy', function() {
            elm.off('scroll', scroll);
            elm.off('mousewheel DOMMouseScroll', mousewheel);
        });

        if (!$scope.enableCellSelection) {
            $scope.domAccessProvider.selectionHandlers($scope, elm);
        }
    };
}]);
