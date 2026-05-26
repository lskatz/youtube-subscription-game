.PHONY: test build clean install

install:
	pixi install

test:
	pixi run test

build: test
	pixi run -- bash -c "cd src && python -m transcrypt -b -n game"
	mkdir -p js
	cp -r src/__target__ js/__target__
	@echo "Build complete. Output in js/__target__/"

clean:
	rm -rf src/__target__ js/__target__ .pytest_cache __pycache__ src/__pycache__ tests/__pycache__
