<script>
	import './styles.css';
</script>

<div id="app">
	<slot />
</div>

<style>
	#app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
