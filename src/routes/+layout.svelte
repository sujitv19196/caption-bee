<script lang="ts">
	import { currentTheme } from '$lib/utils/stores';
	import './styles.css';

	let appTheme = 'light-theme';

	currentTheme.subscribe((theme) => {
		appTheme = theme;
	});
</script>

<div id="app" class={appTheme}>
	<slot />
</div>

<style>
	#app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
