<template>
	<Page>
		<ActionBar>
			<NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
			<Label text="Demo 1" />
		</ActionBar>

		<StackLayout>
			<Label text="The version is:" />
			<CurrencyTextField v-model="amount" symbol="NGN" keyboardType="number" textAlignment="right" />
			<Label text="Result is:" />
			<Label :text="amount" />
		</StackLayout>
	</Page>
</template>

<script>
export default {
	data() {
        return {
		    amount: '0'
        };
	},
    created(){
        console.log("Started 2");
    }
};
</script>

<style lang="scss" scoped></style>